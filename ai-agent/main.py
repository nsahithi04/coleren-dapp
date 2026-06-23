from dotenv import load_dotenv
from langchain.agents import create_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage
from tools import read_knowledge_base, get_schema, query_collection, get_current_datetime
from prompt import system_prompt

load_dotenv()

tools = [read_knowledge_base, get_schema, query_collection, get_current_datetime]

checkpointer = MemorySaver()

agent = create_agent(
    model="google_genai:gemini-2.5-flash",
    tools=tools,
    system_prompt=system_prompt,
    checkpointer=checkpointer,
)

def run_agent(query: str, thread_id: str = "default"):
    config = {"configurable": {"thread_id": thread_id}}

    result = agent.invoke(
        {"messages": [HumanMessage(content=query)]},
        config=config,
    )

    for msg in reversed(result["messages"]):
        if hasattr(msg, "content") and msg.content:
            return msg.content
    return "No response generated."