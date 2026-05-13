from langchain.tools import tool
from pathlib import Path

KNOWLEDGE_PATH = (
    Path(__file__).parent
    / "knowledge"
    / "knowledge_base.txt"
)

@tool
def read_knowledge_base():
    """
    Reads the Coleren knowledge base.

    Use this tool whenever users ask about:
    - Coleren platform
    - pricing
    - onboarding
    - integrations
    - CRM workflows
    - analytics
    - sales features
    - support
    - company/product information

    Always use this tool before answering
    platform-related questions.
    """

    with open(KNOWLEDGE_PATH, "r") as f:
        return f.read()