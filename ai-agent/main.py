from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, SystemMessage
from tools import query_database, get_collections
from prompt import system_prompt

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
)

tools = [get_collections, query_database]

agent = create_react_agent(
    model=llm,
    tools=tools,
    prompt=system_prompt,
)

def run_agent(query: str):
    result = agent.invoke({
        "messages": [HumanMessage(content=query)]
    })

    for msg in reversed(result["messages"]):
        if hasattr(msg, "content") and msg.content:
            return msg.content
    return "No response generated."