
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import databutton as db
from openai import OpenAI
import json
import logging # This will be removed, using print for now

# Configure logging (to be replaced with print for Databutton compatibility)
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
# Instead of logger, we will use print statements:
# print(f"[INFO] Some log message")

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])

# Pydantic models for request and response
class GenerateTestimonialsResponse(BaseModel):
    message: str
    testimonial_count: int
    storage_key: str

class Testimonial(BaseModel):
    quote: str
    author: str
    company: str
    role: str

# Initialize OpenAI client
# It's good practice to fetch the API key once if the module is loaded multiple times,
# though for FastAPI endpoint, it will be fetched on each call unless structured differently.
try:
    openai_api_key = db.secrets.get("OPENAI_API_KEY")
    if not openai_api_key:
        print("[ERROR] OpenAI API key not found in secrets.")
        # In a real app, you might raise an exception or handle this so the app doesn't start misconfigured.
    client = OpenAI(api_key=openai_api_key)
except Exception as e:
    print(f"[ERROR] Failed to initialize OpenAI client: {e}")
    client = None # Ensure client is None if initialization fails

def generate_single_testimonial(developer_name: str, developer_role: str, project_type: str, client_industry: str) -> Testimonial | None:
    """Generates a single testimonial using OpenAI."""
    if not client:
        print("[ERROR] OpenAI client not available for generating testimonial.")
        return None

    prompt_messages = [
        {
            "role": "system",
            "content": f"You are an AI assistant tasked with generating a concise, positive, and authentic-sounding client testimonial for a {developer_role} named {developer_name}. The testimonial should highlight their work on a {project_type} project for a client in the {client_industry} industry. The tone should be professional but genuine. Provide the testimonial quote, a fictional client name, their company, and their role."
        },
        {
            "role": "user",
            "content": f"Please generate a testimonial for {developer_name} who worked as a {developer_role} on a {project_type} for our company in the {client_industry} sector. Highlight aspects like skill, communication, and project impact. Keep the quote to 2-3 sentences."
        }
    ]
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=prompt_messages,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )
        response_content = completion.choices[0].message.content
        print(f"[INFO] OpenAI raw response: {response_content}")

        # Attempt to parse the response. This is a common failure point if the model doesn't adhere to structured output.
        # A more robust solution might involve asking the model for JSON output directly if supported or using regex.
        # For now, we'll assume a simple structure or try to extract info.
        # Example: "Quote: 'Working with ...' Author: John Doe. Company: ACME. Role: CEO."
        # This part needs careful crafting based on expected OpenAI response format.
        # Let's try a very basic split assuming "Quote: ... Author: ... Company: ... Role: ..."
        
        lines = response_content.strip().split('\\n')
        if len(lines) < 4: # Basic check
             # Try to parse common patterns if direct split fails
            quote = "Could not parse quote."
            author = "N/A"
            company = "N/A"
            role = "N/A"

            import re
            quote_match = re.search(r"(?:Quote:|Testimonial:)\s*['\"]?(.*?)['\"]?(?=\s*Author:|$)", response_content, re.IGNORECASE | re.DOTALL)
            if quote_match: quote = quote_match.group(1).strip().replace('\\\"', '\"')
            
            author_match = re.search(r"Author:\s*(.*?)(?=\s*Company:|$)", response_content, re.IGNORECASE)
            if author_match: author = author_match.group(1).strip()
            
            company_match = re.search(r"Company:\s*(.*?)(?=\s*Role:|$)", response_content, re.IGNORECASE)
            if company_match: company = company_match.group(1).strip()
            
            role_match = re.search(r"Role:\s*(.*?)(?=$)", response_content, re.IGNORECASE)
            if role_match: role = role_match.group(1).strip()

            if quote == "Could not parse quote.": # Fallback if regex fails badly
                 print(f"[WARNING] Could not parse testimonial details from response: {response_content}")
                 return Testimonial(quote="Failed to generate a well-formatted testimonial.", author="AI System", company="Internal", role="Content Generator")

        else: # If split works (ideal but less likely)
            quote = lines[0].replace("Quote: ", "").strip().replace('\\\"', '\"')
            author = lines[1].replace("Author: ", "").strip()
            company = lines[2].replace("Company: ", "").strip()
            role = lines[3].replace("Role: ", "").strip()


        return Testimonial(quote=quote, author=author, company=company, role=role)

    except Exception as e:
        print(f"[ERROR] Error generating testimonial with OpenAI: {e}")
        return None


@router.post("/generate-testimonials", response_model=GenerateTestimonialsResponse)
def generate_and_store_testimonials():
    """
    Generates 5-6 diverse testimonials using OpenAI and stores them in Databutton storage.
    """
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI client is not configured. Check API key.")

    developer_name = "Mwenda_Dipark" # User's name
    developer_role = "Full-Stack Developer"
    
    # Diverse scenarios for testimonials
    scenarios = [
        {"project_type": "AI-Powered E-commerce Platform", "client_industry": "Retail Tech"},
        {"project_type": "Real-time Data Analytics Dashboard", "client_industry": "Financial Services"},
        {"project_type": "Collaborative Project Management Tool", "client_industry": "SaaS / Technology"},
        {"project_type": "Mobile Health & Wellness App", "client_industry": "Healthcare"},
        {"project_type": "Custom CRM Integration", "client_industry": "B2B Services"},
        {"project_type": "Educational Platform Development", "client_industry": "EdTech"}
    ]
    
    generated_testimonials = []
    for i, scenario in enumerate(scenarios[:5]): # Generate 5 testimonials
        print(f"[INFO] Generating testimonial {i+1} for {scenario['project_type']} in {scenario['client_industry']}")
        testimonial = generate_single_testimonial(
            developer_name=developer_name,
            developer_role=developer_role,
            project_type=scenario["project_type"],
            client_industry=scenario["client_industry"]
        )
        if testimonial:
            generated_testimonials.append(testimonial.model_dump()) # Store as dict
        else:
            print(f"[WARNING] Failed to generate testimonial for scenario: {scenario}")
            # Optionally, add a placeholder or skip
            generated_testimonials.append(Testimonial(
                quote=f"Placeholder for a great testimonial about the {scenario['project_type']}.",
                author="Satisfied Client",
                company=f"{scenario['client_industry']} Co.",
                role="Project Lead"
            ).model_dump())


    if not generated_testimonials:
        print("[ERROR] No testimonials were generated.")
        raise HTTPException(status_code=500, detail="Failed to generate any testimonials.")

    storage_key = "testimonials.json"
    try:
        db.storage.json.put(storage_key, generated_testimonials)
        print(f"[INFO] Successfully stored {len(generated_testimonials)} testimonials at {storage_key}")
    except Exception as e:
        print(f"[ERROR] Failed to store testimonials: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to store testimonials: {str(e)}")

    return GenerateTestimonialsResponse(
        message="Testimonials generated and stored successfully.",
        testimonial_count=len(generated_testimonials),
        storage_key=storage_key
    )

@router.get("/view-testimonials", response_model=list[Testimonial])
def get_testimonials():
    """
    Retrieves the stored testimonials.
    """
    storage_key = "testimonials.json"
    try:
        testimonials_data = db.storage.json.get(storage_key, default=[])
        # Ensure data is parsed into Testimonial models for response validation
        return [Testimonial(**data) for data in testimonials_data]
    except FileNotFoundError:
        print(f"[INFO] Testimonials file not found at {storage_key}. Returning empty list.")
        return []
    except Exception as e:
        print(f"[ERROR] Failed to retrieve testimonials: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve testimonials: {str(e)}")

