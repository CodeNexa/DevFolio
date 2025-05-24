from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import databutton as db
from openai import OpenAI
import os

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    question: str
    session_id: str | None = None # Optional: for maintaining context in future enhancements

class ChatResponse(BaseModel):
    answer: str
    session_id: str | None = None

# --- OpenAI Client Initialization ---
openai_api_key = db.secrets.get("OPENAI_API_KEY")
if not openai_api_key:
    print("[ERROR] Chatbot API: OPENAI_API_KEY not found in Databutton secrets.")
    # Raising an exception or handling it appropriately in a real app is crucial
    # For now, endpoint will fail if key is missing.
    client = None
else:
    client = OpenAI(api_key=openai_api_key)

# --- Developer Context for the Chatbot ---
# This information can be expanded or dynamically fetched in more advanced versions.
DEVELOPER_NAME = "Mwenda_Dipark Solutions"
DEVELOPER_ROLE = "Full-Stack Developer"
CORE_SKILLS = ["Python", "React", "MongoDB", "PostgreSQL", "FastAPI", "TypeScript", "Tailwind CSS", "Node.js", "Docker", "AWS"]
PROJECT_HIGHLIGHTS = [
    "DevFolio AI: An intelligent portfolio website with an AI chatbot assistant (this very project!). Technologies: React, FastAPI, OpenAI.",
    "IntelliShop AI Platform: An e-commerce solution with AI-driven recommendations and dynamic pricing. Technologies: Python, React, PostgreSQL, TensorFlow.",
    "LiveInsights Analytics Dashboard: A real-time data visualization tool for business intelligence. Technologies: React, Node.js, WebSocket, MongoDB, D3.js.",
    "TaskFlow Pro Manager: A SaaS application for team collaboration and agile project management. Technologies: React, Node.js, PostgreSQL, GraphQL."
]
ABOUT_DEVELOPER = f"""
{DEVELOPER_NAME} is a proficient {DEVELOPER_ROLE} with a strong background in building innovative and efficient solutions.
Key technical proficiencies include: {', '.join(CORE_SKILLS)}.
{DEVELOPER_NAME} has experience in developing a range of applications, from AI-integrated web platforms to data analytics dashboards and collaborative tools.
Example projects include:
- {PROJECT_HIGHLIGHTS[0]}
- {PROJECT_HIGHLIGHTS[1]}
- {PROJECT_HIGHLIGHTS[2]}
- {PROJECT_HIGHLIGHTS[3]}
When answering questions, be concise, friendly, and professional. If you don't know the answer or if it's outside your scope of knowledge about {DEVELOPER_NAME}, politely say so.
Do not answer questions unrelated to {DEVELOPER_NAME}'s professional profile, skills, or projects.
"""

@router.post("/chat", response_model=ChatResponse)
async def handle_chat_message(request: ChatRequest):
    if not client:
        print("[ERROR] Chatbot API: OpenAI client not initialized. API key might be missing.")
        raise HTTPException(status_code=500, detail="Chatbot service is currently unavailable due to a configuration error.")

    system_prompt = f"""
You are a helpful AI assistant for {DEVELOPER_NAME}.
Your purpose is to answer questions from potential clients or recruiters about {DEVELOPER_NAME}'s skills, experience, and projects.
You have the following information about {DEVELOPER_NAME}:
{ABOUT_DEVELOPER}
Please use this information to answer the user's questions.
Keep your answers focused on {DEVELOPER_NAME}.
If a question is vague, ask for clarification.
If a question is unrelated to {DEVELOPER_NAME}'s professional profile, politely decline to answer.
"""

    user_question = request.question

    print(f"[INFO] Chatbot API: Received question: {user_question}")
    print(f"[INFO] Chatbot API: Using session_id: {request.session_id if request.session_id else 'N/A'}")

    try:
        completion = await client.chat.completions.create( # Changed to async call
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_question}
            ],
            max_tokens=250, # Increased token limit for potentially more detailed answers
            temperature=0.5, # Slightly lower temperature for more factual, less creative answers
        )
        ai_answer = completion.choices[0].message.content
        print(f"[INFO] Chatbot API: OpenAI response: {ai_answer}")

        return ChatResponse(answer=ai_answer or "I'm sorry, I couldn't generate a response at this moment.", session_id=request.session_id)

    except Exception as e:
        print(f"[ERROR] Chatbot API: Error communicating with OpenAI: {str(e)}")
        raise HTTPException(status_code=503, detail=f"Error processing chat message: {str(e)}")

