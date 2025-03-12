import re
import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv
import logging

# Load Hugging Face API Key
load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")

# Hugging Face API Config
API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large"
HEADERS = {"Authorization": f"Bearer {HF_API_KEY}"}

# Setup logging
logging.basicConfig(level=logging.INFO)

# FastAPI App
app = FastAPI()

class TaskRequest(BaseModel):
    task: str

    @field_validator('task')
    def task_must_not_be_empty(cls, value):
        if not value.strip():  # check for empty or whitespace-only tasks
            raise ValueError("Task cannot be empty")
        return value

@app.post("/break-task/")
def break_task(request: TaskRequest):
    task = request.task.strip()

    # Improved prompt to enforce distinct steps and clarity
    prompt = (
        f"Break down the task '{task}' into a structured, step-by-step plan. "
        "Provide exactly 7 distinct steps, with no repetition, and each step should progressively build on the previous one. "
        "Strictly format as:\n"
        "1. First step\n2. Second step\n3. Third step\n4. Fourth step\n5. Fifth step\n6. Sixth step\n7. Seventh step\n"
    )

    payload = {"inputs": prompt}

    try:
        logging.info(f"Sending request to Hugging Face API for task: '{task}'")

        response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=10)  # Timeout to prevent long hangs
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx, 5xx)

        if response.status_code == 200:
            result = response.json()

            # Handle API errors
            if isinstance(result, dict) and "error" in result:
                raise HTTPException(status_code=500, detail=f"Hugging Face API Error: {result['error']}")

            if isinstance(result, list) and "generated_text" in result[0]:
                steps_text = result[0]["generated_text"]
            else:
                return {"task": task, "steps": ["No actionable steps found. Try refining your task description."]}

            # Extract steps using refined regex
            steps = re.findall(r"^\d+\.\s*(.+)$", steps_text, re.MULTILINE)

            # Remove malformed or repeated steps
            unique_steps = []
            seen = set()

            for step in steps:
                step_clean = step.strip().lower()  # Case-insensitive and strip extra spaces
                if step_clean and step_clean not in seen:
                    seen.add(step_clean)
                    unique_steps.append(step.strip())

            # If steps are malformed or too few, return a default response
            if not unique_steps:
                unique_steps = ["Could not break down the task properly. Please try refining your input."]
            
            logging.info(f"Task '{task}' was broken into steps: {unique_steps}")
            return {"task": task, "steps": unique_steps}

        else:
            logging.error(f"Unexpected status code {response.status_code} from Hugging Face API.")
            raise HTTPException(status_code=500, detail="Unexpected response from Hugging Face API")

    except requests.exceptions.RequestException as e:
        logging.error(f"Request failed: {e}")
        raise HTTPException(status_code=500, detail="Error connecting to Hugging Face API")
