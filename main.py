import os
import json
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

class RecipeRequest(BaseModel):
    ingredients: List[str]

class Recipe(BaseModel):
    title: str
    ingredients: List[str]
    instructions: List[str]
    time: str

class RecipeResponse(BaseModel):
    recipes: List[Recipe]

@app.post("/api/generate_recipes", response_model=RecipeResponse)
async def generate_recipes(request: RecipeRequest):
    prompt = f"Olet kokki. Luo tasan 3 reseptiä näistä aineksista: {request.ingredients}. Palauta puhdas JSON objekti."

    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=RecipeResponse
        )
    )

    return json.loads(response.text)