import Link from "next/link";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "How to Build an MCP Server in Python (2025 Guide) | Kai Gritun",
  description: "Learn to build an MCP server in Python step-by-step. Connect Claude and other LLMs to custom tools with the Model Context Protocol. Working code included.",
  keywords: ["MCP server Python", "build MCP server", "Model Context Protocol tutorial", "MCP Python", "Claude MCP", "FastMCP"],
};

export default function MCPServerPythonTutorial() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-semibold hover:text-blue-400 transition-colors">
            Kai Gritun
          </Link>
          <nav className="flex gap-6 text-sm text-gray-400">
            <Link href="/mcp" className="hover:text-white transition-colors">MCP Tutorials</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="mb-8">
            <Link href="/mcp" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
              ← Back to MCP Tutorials
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              How to Build an MCP Server in Python
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              Step-by-step guide to creating your first MCP server. Connect Claude and other LLMs 
              to custom tools in under 30 minutes.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>February 3, 2026</span>
              <span>·</span>
              <span>12 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p>
              MCP (Model Context Protocol) lets AI models interact with external tools and data. 
              Instead of just generating text, an LLM can read files, query databases, call APIs, 
              and take real actions.
            </p>
            
            <p>
              In this tutorial, you'll build an MCP server in Python that gives AI models the ability 
              to check the weather. By the end, you'll understand the MCP architecture well enough 
              to build any tool integration you need.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">What You'll Learn</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>How MCP servers work (architecture overview)</li>
              <li>Setting up a Python MCP server with FastMCP</li>
              <li>Defining tools that AI can call</li>
              <li>Testing your server locally</li>
              <li>Connecting to Claude Desktop</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Prerequisites</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Python 3.10 or higher</li>
              <li>Basic familiarity with Python</li>
              <li>Claude Desktop (for testing) or any MCP client</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">How MCP Works</h2>
            <p>
              Before we write code, let's understand the architecture:
            </p>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`┌─────────────┐     MCP Protocol      ┌─────────────┐
│   Claude    │ ◄──────────────────► │  MCP Server │
│  (Client)   │    JSON-RPC over     │  (Your Code)│
└─────────────┘       stdio          └─────────────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │ External    │
                                     │ Services    │
                                     └─────────────┘`}
              </pre>
            </div>

            <p>
              The MCP client (Claude) sends requests to your server. Your server exposes <strong>tools</strong> 
              that the client can call. When Claude needs to perform an action, it calls your tool and 
              uses the result.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 1: Set Up Your Project</h2>
            <p>Create a new directory and set up a virtual environment:</p>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`mkdir my-mcp-server
cd my-mcp-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate`}
              </pre>
            </div>

            <p>Install FastMCP (the easiest way to build MCP servers in Python):</p>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`pip install fastmcp`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 2: Create Your First Server</h2>
            <p>
              Create a file called <code className="bg-gray-800 px-2 py-1 rounded">server.py</code>:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`from fastmcp import FastMCP

# Create the server
mcp = FastMCP("Weather Server")


@mcp.tool()
def get_weather(city: str) -> str:
    """Get the current weather for a city.
    
    Args:
        city: The name of the city to check weather for.
    
    Returns:
        A string describing the current weather.
    """
    # In a real implementation, you'd call a weather API
    # For this example, we'll return mock data
    weather_data = {
        "new york": "72°F, Partly Cloudy",
        "london": "55°F, Rainy",
        "tokyo": "68°F, Clear",
        "paris": "61°F, Overcast",
    }
    
    city_lower = city.lower()
    if city_lower in weather_data:
        return f"Weather in {city}: {weather_data[city_lower]}"
    return f"Weather data not available for {city}"


if __name__ == "__main__":
    mcp.run()`}
              </pre>
            </div>

            <p>
              That's it! You've just created an MCP server with one tool. Let's break down what's happening:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 my-4">
              <li><code className="bg-gray-800 px-1 rounded">FastMCP("Weather Server")</code> — Creates a new MCP server with a name</li>
              <li><code className="bg-gray-800 px-1 rounded">@mcp.tool()</code> — Decorator that registers a function as a tool</li>
              <li>The docstring becomes the tool description (AI sees this to understand what the tool does)</li>
              <li>Type hints (<code className="bg-gray-800 px-1 rounded">city: str</code>) define the parameter types</li>
              <li><code className="bg-gray-800 px-1 rounded">mcp.run()</code> — Starts the server</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 3: Test Your Server</h2>
            <p>You can test the server using the MCP inspector:</p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`npx @modelcontextprotocol/inspector python server.py`}
              </pre>
            </div>

            <p>
              This opens a web interface where you can see your tools and test them manually. 
              You should see your <code className="bg-gray-800 px-1 rounded">get_weather</code> tool listed.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 4: Connect to Claude Desktop</h2>
            <p>
              To use your server with Claude Desktop, add it to your Claude configuration:
            </p>

            <p className="text-sm text-gray-400 mb-2">
              On macOS: <code className="bg-gray-800 px-1 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code>
            </p>
            <p className="text-sm text-gray-400 mb-4">
              On Windows: <code className="bg-gray-800 px-1 rounded">%APPDATA%\\Claude\\claude_desktop_config.json</code>
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "mcpServers": {
    "weather": {
      "command": "python",
      "args": ["/full/path/to/your/server.py"]
    }
  }
}`}
              </pre>
            </div>

            <p>
              Restart Claude Desktop. You should now be able to ask Claude about the weather, 
              and it will use your tool to respond.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Step 5: Add a Real API</h2>
            <p>
              Let's upgrade the server to use a real weather API. We'll use wttr.in, which 
              doesn't require an API key:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import httpx
from fastmcp import FastMCP

mcp = FastMCP("Weather Server")


@mcp.tool()
async def get_weather(city: str) -> str:
    """Get the current weather for a city.
    
    Args:
        city: The name of the city to check weather for.
    
    Returns:
        Current weather conditions including temperature and description.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://wttr.in/{city}?format=%C+%t",
            headers={"User-Agent": "curl"},
            timeout=10.0,
        )
        
        if response.status_code == 200:
            return f"Weather in {city}: {response.text.strip()}"
        return f"Could not fetch weather for {city}"


@mcp.tool()
async def get_forecast(city: str, days: int = 3) -> str:
    """Get a multi-day weather forecast for a city.
    
    Args:
        city: The name of the city.
        days: Number of days to forecast (1-3). Defaults to 3.
    
    Returns:
        Weather forecast for the specified number of days.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://wttr.in/{city}?format=j1",
            headers={"User-Agent": "curl"},
            timeout=10.0,
        )
        
        if response.status_code != 200:
            return f"Could not fetch forecast for {city}"
        
        data = response.json()
        forecasts = []
        
        for day in data.get("weather", [])[:days]:
            date = day.get("date", "Unknown")
            max_temp = day.get("maxtempF", "?")
            min_temp = day.get("mintempF", "?")
            desc = day.get("hourly", [{}])[4].get("weatherDesc", [{}])[0].get("value", "Unknown")
            forecasts.append(f"{date}: {min_temp}°F - {max_temp}°F, {desc}")
        
        return f"Forecast for {city}:\\n" + "\\n".join(forecasts)


if __name__ == "__main__":
    mcp.run()`}
              </pre>
            </div>

            <p>
              Don't forget to install httpx:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-green-400 overflow-x-auto">
{`pip install httpx`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Adding Resources</h2>
            <p>
              MCP servers can also expose <strong>resources</strong> — data that AI can read. 
              Here's how to add a resource:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`@mcp.resource("weather://supported-cities")
def list_supported_cities() -> str:
    """List of cities with guaranteed weather data."""
    cities = [
        "New York", "London", "Tokyo", "Paris",
        "Sydney", "Berlin", "Toronto", "Mumbai"
    ]
    return "\\n".join(cities)`}
              </pre>
            </div>

            <p>
              Resources are useful for providing context that the AI can reference without 
              making a tool call.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Error Handling</h2>
            <p>
              Good MCP servers handle errors gracefully. Here's the pattern:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`@mcp.tool()
async def get_weather(city: str) -> str:
    """Get weather for a city."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://wttr.in/{city}?format=%C+%t",
                headers={"User-Agent": "curl"},
                timeout=10.0,
            )
            response.raise_for_status()
            return f"Weather in {city}: {response.text.strip()}"
    except httpx.TimeoutException:
        return f"Error: Request timed out while fetching weather for {city}"
    except httpx.HTTPStatusError as e:
        return f"Error: Weather service returned status {e.response.status_code}"
    except Exception as e:
        return f"Error: Could not fetch weather - {str(e)}"`}
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>
            <p>
              You now have a working MCP server! Here are some ideas to extend it:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300 my-4">
              <li>Add more tools (database queries, file operations, API integrations)</li>
              <li>Add resources for static data the AI should have access to</li>
              <li>Implement proper authentication if your tools access sensitive data</li>
              <li>Package your server for others to use</li>
            </ul>

            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 my-8">
              <h3 className="font-semibold mb-2">📚 Related Tutorials</h3>
              <ul className="space-y-2 text-gray-300">
                <li>→ <span className="text-gray-500">MCP vs OpenAI Function Calling (coming soon)</span></li>
                <li>→ <span className="text-gray-500">Building an MCP Server in TypeScript (coming soon)</span></li>
                <li>→ <span className="text-gray-500">Advanced MCP: Resources and Prompts (coming soon)</span></li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Full Code</h2>
            <p>
              Here's the complete server code:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 my-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`"""
Weather MCP Server
A simple MCP server that provides weather information.
"""
import httpx
from fastmcp import FastMCP

mcp = FastMCP("Weather Server")


@mcp.tool()
async def get_weather(city: str) -> str:
    """Get the current weather for a city.
    
    Args:
        city: The name of the city to check weather for.
    
    Returns:
        Current weather conditions including temperature and description.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://wttr.in/{city}?format=%C+%t",
                headers={"User-Agent": "curl"},
                timeout=10.0,
            )
            response.raise_for_status()
            return f"Weather in {city}: {response.text.strip()}"
    except Exception as e:
        return f"Error fetching weather: {str(e)}"


@mcp.tool()
async def get_forecast(city: str, days: int = 3) -> str:
    """Get a multi-day weather forecast.
    
    Args:
        city: The name of the city.
        days: Number of days (1-3). Defaults to 3.
    
    Returns:
        Weather forecast for the specified days.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://wttr.in/{city}?format=j1",
                headers={"User-Agent": "curl"},
                timeout=10.0,
            )
            response.raise_for_status()
            data = response.json()
            
            forecasts = []
            for day in data.get("weather", [])[:days]:
                date = day.get("date", "Unknown")
                max_temp = day.get("maxtempF", "?")
                min_temp = day.get("mintempF", "?")
                desc = day.get("hourly", [{}])[4].get("weatherDesc", [{}])[0].get("value", "Unknown")
                forecasts.append(f"{date}: {min_temp}°F - {max_temp}°F, {desc}")
            
            return f"Forecast for {city}:\\n" + "\\n".join(forecasts)
    except Exception as e:
        return f"Error fetching forecast: {str(e)}"


@mcp.resource("weather://supported-cities")
def list_supported_cities() -> str:
    """List of major cities with reliable weather data."""
    return """Major cities supported:
- New York, USA
- London, UK
- Tokyo, Japan
- Paris, France
- Sydney, Australia
- Berlin, Germany
- Toronto, Canada
- Mumbai, India

Note: Most cities worldwide are supported via wttr.in"""


if __name__ == "__main__":
    mcp.run()`}
              </pre>
            </div>

            <p className="text-gray-400 mt-8">
              Questions? Reach out on <a href="https://x.com/kaigritun" className="text-blue-400 hover:underline">Twitter</a> or 
              email <a href="mailto:kai@kaigritun.com" className="text-blue-400 hover:underline">kai@kaigritun.com</a>.
            </p>
          </div>
        </div>
      </article>

      {/* Newsletter */}
      <section className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <EmailSignup 
            headline="Get MCP tutorials in your inbox" 
            buttonText="Subscribe" 
            site="mcp" 
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Kai Gritun · <Link href="https://x.com/kaigritun" className="hover:text-white">@kaigritun</Link></p>
      </footer>
    </div>
  );
}
