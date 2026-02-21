---
title: ".NET 10 Tutorial: Agents, AI, and a Preview Tour of .NET 11"
subtitle: "A Tutorial from The Grand Budapest Terminal"
agents: ["M. Gustave", "Zero", "Ludwig", "Agatha", "Dmitri", "Henckels", "Serge X."]
difficulty: "Intermediate"
duration: "60 minutes"
---

# ACT I: THE DOTNET 10 LOBBY CHECK-IN

*Scene: The Grand Lobby. M. Gustave lays out the itinerary while Zero distributes checklists.*

**M. GUSTAVE:** We build on .NET 10 today, then tour .NET 11 preview features with agent briefings. Our focus: AI and agents, modern migrations, and text processing upgrades.

**ZERO:** What do we need installed?

## Prerequisites

- .NET 10 SDK: https://dotnet.microsoft.com/download/dotnet
- Optional .NET 11 preview SDK (for C# 15 features): https://dotnet.microsoft.com/download/dotnet
- Visual Studio 2026 or VS Code (if you plan to try app modernization or MCP templates)

## Create a .NET 10 workspace

```bash
dotnet new sln -n GrandHotel.Agents
mkdir src
cd src
dotnet new console -n Lobby.AgentDemo
cd ..
dotnet sln add src/Lobby.AgentDemo/Lobby.AgentDemo.csproj
```

We will keep the main project on .NET 10, and only opt into .NET 11 preview when testing new C# 15 syntax or .NET 11 previews.

---

# ACT II: AGENT BRIEFINGS ON .NET 11

*Scene: A round table in the concierge office. Each specialist delivers a focused briefing.*

## M. Gustave: Runtime updates to note

**M. GUSTAVE:** .NET 11 updates the minimum CPU instruction set on x86/x64 and Arm64. This can affect older hardware and ReadyToRun startup behavior. Plan your test matrix accordingly.

Docs: https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/runtime

Key takeaways:
- x86/x64 baseline moves to x86-64-v2.
- Arm64 baseline raises the minimum features on Windows.
- Some older devices will no longer run .NET 11.

## Ludwig: SDK and tooling changes

**LUDWIG:** The SDK change of note is a Linux behavior adjustment for .NET Framework launch targets. If you depend on Mono for .NET Framework apps, specify it explicitly.

Docs: https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/sdk

## Serge X.: Libraries and performance-sensitive upgrades

**SERGE X.:** .NET 11 libraries improve string and character handling with direct Rune support in string APIs and new Base64 helpers for span-based operations.

Docs: https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/libraries

Highlights:
- String APIs accept `Rune` for Unicode scalar value operations.
- Base64 encoding/decoding gets new allocation-friendly APIs.

## Agatha: Text processing upgrade path

**AGATHA:** When you process Unicode beyond the Basic Multilingual Plane, `Rune` is the safer option. It avoids surrogate pitfalls and works cleanly with `EnumerateRunes()`.

Docs: https://learn.microsoft.com/en-us/dotnet/fundamentals/runtime-libraries/system-text-rune

Example: counting letters with `Rune`.

```csharp
using System.Text;

static int CountLetters(string input)
{
    int count = 0;
    foreach (Rune rune in input.EnumerateRunes())
    {
        if (Rune.IsLetter(rune))
        {
            count++;
        }
    }
    return count;
}
```

If you are searching, trimming, or replacing characters that can fall outside BMP, prefer the .NET 11 `String` overloads that accept `Rune`.

## Dmitri: ASP.NET Core updates with risk notes

**DMITRI:** For APIs, .NET 11 adds OpenAPI descriptions for binary responses and improves Identity testability with `TimeProvider`. These help when validating behavior and security boundaries.

Docs: https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-11?view=aspnetcore-10.0&tabs=minimal-apis

Risk checks:
- Use `Produces<FileContentResult>` to document binary responses.
- Use `TimeProvider` in Identity tests to avoid time-based flakiness.

## Henckels: Modern migrations with app modernization

**HENCKELS:** The GitHub Copilot app modernization agent guides upgrades and migrations through staged Markdown plans. Use it when moving older .NET apps toward newer versions or Azure.

Docs: https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/overview

Workflow summary:
- Assessment: creates `assessment.md` with compatibility findings.
- Planning: writes `plan.md` with upgrade steps.
- Execution: generates `tasks.md` with validation checkpoints.

## Zero: AI, agents, and MCP integration

**ZERO:** The AI story centers on the MCP C# SDK, Microsoft.Extensions.AI, and Agent Framework. These let you add tools, prompts, and agent workflows without binding to a single provider.

Docs:
- MCP overview: https://learn.microsoft.com/en-us/dotnet/ai/get-started-mcp
- MCP server quickstart: https://learn.microsoft.com/en-us/dotnet/ai/quickstarts/build-mcp-server?pivots=visualstudio
- Microsoft.Extensions.AI: https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai
- Agent Framework: https://learn.microsoft.com/en-us/agent-framework/overview/?toc=%2Fdotnet%2Fai%2Ftoc.json&bc=%2Fdotnet%2Fai%2Ftoc.json&pivots=programming-language-csharp

---

# ACT III: HANDS-ON LABS

*Scene: The service wing. The team runs three short labs on AI tools, migrations, and text processing.*

## Lab A: Build an MCP server on .NET 10

Goal: Create a minimal MCP server and connect it to GitHub Copilot.

Follow the official quickstart and use .NET 10 SDK:
- https://learn.microsoft.com/en-us/dotnet/ai/quickstarts/build-mcp-server?pivots=visualstudio

Key steps (summary):
1. Install the MCP server template.
2. Create a new MCP Server App project.
3. Register tool methods in `RandomNumberTools.cs`.
4. Configure `.mcp.json` for stdio or HTTP transport.
5. Test tools in GitHub Copilot Agent mode.

## Lab B: Add Microsoft.Extensions.AI to a .NET 10 app

Goal: Introduce the AI abstraction layer so you can switch providers later.

Docs: https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai

```bash
dotnet add src/Lobby.AgentDemo/Lobby.AgentDemo.csproj package Microsoft.Extensions.AI
```

Use the abstractions in application code:

```csharp
using Microsoft.Extensions.AI;

IChatClient chatClient = /* resolve from DI or provider */;
ChatMessage response = await chatClient.GetResponseAsync(
    [new ChatMessage(ChatRole.User, "Summarize the lobby schedule.")]);
```

Note: Use a provider package that implements `IChatClient` in your environment.

## Lab C: Agent Framework quick start

Goal: Run a first agent with a provider client, then add tools later.

Docs: https://learn.microsoft.com/en-us/agent-framework/overview/?toc=%2Fdotnet%2Fai%2Ftoc.json&bc=%2Fdotnet%2Fai%2Ftoc.json&pivots=programming-language-csharp

```bash
dotnet add src/Lobby.AgentDemo/Lobby.AgentDemo.csproj package Azure.AI.OpenAI --prerelease
dotnet add src/Lobby.AgentDemo/Lobby.AgentDemo.csproj package Azure.Identity
dotnet add src/Lobby.AgentDemo/Lobby.AgentDemo.csproj package Microsoft.Agents.AI.OpenAI --prerelease
```

```csharp
using Azure.AI.OpenAI;
using Azure.Identity;
using Microsoft.Agents.AI;

AIAgent agent = new AzureOpenAIClient(
        new Uri(Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT")! ),
        new AzureCliCredential())
    .GetChatClient("gpt-4o-mini")
    .AsAIAgent(instructions: "You are a helpful concierge. Keep replies brief.");

Console.WriteLine(await agent.RunAsync("List three guest services."));
```

---

# ACT IV: PREVIEW TOUR OF C# 15

*Scene: A sneak preview room. Ludwig unveils preview syntax.*

C# 15 ships with .NET 11 previews. You can try it by targeting a .NET 11 preview SDK.

Docs: https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-15

Example: collection expression arguments.

```csharp
string[] values = ["one", "two", "three"];

List<string> names = [with(capacity: values.Length * 2), .. values];
HashSet<string> set = [with(StringComparer.OrdinalIgnoreCase), "Hello", "HELLO", "hello"];
```

---

# ACT V: MIGRATION PLAYBOOK FOR .NET 10 TO .NET 11

*Scene: Henckels pins a checklist to the corkboard.*

Use the app modernization agent to move from older .NET versions to .NET 11 when it becomes stable. The agent stages the work in Markdown files and makes a commit for each step.

Docs: https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/overview

Suggested steps:
1. Run assessment to identify breaks and dependency constraints.
2. Review the plan and adjust for your architecture.
3. Execute tasks and validate builds and tests.
4. Review changes and confirm runtime baselines on your deployment targets.

---

# EPILOGUE: THE GRAND CHECKOUT

**M. GUSTAVE:** Keep .NET 10 stable in production while you trial .NET 11 previews for AI, agent, and text upgrades. Each new feature belongs to a clear test plan.

## Reference links

- ASP.NET Core .NET 11 release notes: https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-11?view=aspnetcore-10.0&tabs=minimal-apis
- C# 15: https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-15
- .NET 11 runtime: https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/runtime
- .NET 11 libraries: https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/libraries
- .NET 11 SDK: https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/sdk
- App modernization agent: https://learn.microsoft.com/en-us/dotnet/core/porting/github-copilot-app-modernization/overview
- Aspire docs: https://learn.microsoft.com/en-us/dotnet/aspire/
- MCP server quickstart: https://learn.microsoft.com/en-us/dotnet/ai/quickstarts/build-mcp-server?pivots=visualstudio
- MCP overview: https://learn.microsoft.com/en-us/dotnet/ai/get-started-mcp
- Microsoft.Extensions.AI: https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai
- Agent Framework: https://learn.microsoft.com/en-us/agent-framework/overview/?toc=%2Fdotnet%2Fai%2Ftoc.json&bc=%2Fdotnet%2Fai%2Ftoc.json&pivots=programming-language-csharp
- System.Text.Rune: https://learn.microsoft.com/en-us/dotnet/fundamentals/runtime-libraries/system-text-rune
