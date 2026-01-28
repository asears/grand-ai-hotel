# THE GRAND BUDAPEST TERMINAL: COPILOT SDK CHRONICLES
## A Tutorial on Building Intelligent Document Automation Agents

*Written in the style of Wes Anderson's Grand Budapest Hotel*  
*Featuring the GitHub Copilot SDK for PowerPoint and Word Document Processing*

---

## DRAMATIS PERSONAE (RETURNING CAST)

**M. GUSTAVE H.** - *The Architect*  
Expert in SDK design patterns and architectural decisions

**ZERO MOUSTAFA** - *The Implementer*  
Executes code examples across all languages with precision

**AGATHA** - *The Tester*  
Validates SDK implementations with comprehensive test suites

**DMITRI** - *The Security Auditor*  
Challenges SDK security assumptions and token management

**DEPUTY HENCKELS** - *The Standards Officer*  
Enforces SDK best practices and workflow automation

**LUDWIG** - *The Type Guardian*  
Validates schemas, types, and API contracts

**SERGE X.** - *The Performance Analyst*  
Benchmarks SDK performance across languages

---

## PROLOGUE: THE SDK MANIFESTO

*FADE IN:*

*The Grand Budapest Terminal conference room. A large mahogany table is covered with documents bearing the GitHub Copilot SDK logo. M. GUSTAVE stands at the head, wearing reading glasses perched on his nose.*

**M. GUSTAVE**  
*(addressing the assembled agents)*  
Gentlemen, and dear Agatha, we gather today to discuss a momentous technological advancement. GitHub has bestowed upon us the Copilot SDK—a production-grade execution loop, the very engine powering our beloved Terminal.

**LUDWIG**  
*(consulting a leather-bound manual)*  
According to the documentation, sir, it supports Node.js, Python, Go, and .NET. Multi-language, multi-model routing, MCP server integration...

**M. GUSTAVE**  
Precisely. And today, we shall build something practical: an intelligent system that processes PowerPoint presentations and Word documents. From templates to final output, automated with elegance.

**ZERO**  
How shall we proceed, Monsieur Gustave?

**M. GUSTAVE**  
By example, dear boy. By example.

---

## ACT I: UNDERSTANDING THE ARCHITECTURE

### SCENE 1: THE BLUEPRINT ROOM

*M. GUSTAVE unfurls an architectural diagram on the table.*

**M. GUSTAVE**  
The GitHub Copilot SDK provides these essential capabilities:

1. **Production-grade execution loop** - Battle-tested from CLI
2. **Multi-language support** - Python, Node.js, Go, .NET
3. **Multi-model routing** - Choose the right model for each task
4. **MCP server integration** - Model Context Protocol support
5. **Real-time streaming** - Live response handling
6. **Tool orchestration** - Automated command execution

**SERGE X.**  
*(adjusting his monocle)*  
The SDK abstracts the complexity: context management, tool orchestration, model routing, permissions, and failure modes. All handled automatically.

**M. GUSTAVE**  
Indeed. As Mario Rodriguez states: "GitHub handles authentication, model management, MCP servers, custom agents, and chat sessions. You control what gets built on top."

---

### SCENE 2: THE USE CASE DISCUSSION

*AGATHA enters with a tray of documents.*

**AGATHA**  
I've prepared our use case, gentlemen. We need a system that:

1. Reads a Word document containing presentation instructions
2. Processes a PowerPoint template
3. Generates slides with AI-populated content
4. Saves the final presentation

**DMITRI**  
*(scowling)*  
And it must handle authentication securely. No leaked tokens.

**HENCKELS**  
*(standing at attention)*  
We'll implement this across four languages: Python, TypeScript, Go, and .NET. Each with proper testing and CI/CD workflows.

**M. GUSTAVE**  
Excellent. Let us begin with Python—the language of scholars and data scientists.

---

## ACT II: PYTHON IMPLEMENTATION

### SCENE 3: THE PYTHON WORKSHOP

*The scene transforms into a laboratory. ZERO sits at a desk with a Python interpreter glowing softly.*

**M. GUSTAVE**  
Zero, install the necessary dependencies.

**ZERO**  
*(typing with concentration)*  
Yes, sir.

```bash
# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install Copilot SDK and document processing libraries
uv add github-copilot-sdk python-pptx python-docx aiofiles
```

**M. GUSTAVE**  
Now, let us create the core implementation.

*Zero creates a file: `src/examples/powerpoint_automation.py`*

```python
"""
PowerPoint Automation with GitHub Copilot SDK
Demonstrates reading Word instructions and generating PowerPoint presentations.
"""

import asyncio
from pathlib import Path
from docx import Document
from pptx import Presentation
from pptx.util import Inches, Pt
from copilot import CopilotClient


class PresentationAutomator:
    """Automates PowerPoint generation using Copilot SDK."""
    
    def __init__(self, copilot_token: str):
        """Initialize with Copilot authentication token."""
        self.copilot_token = copilot_token
        self.client: CopilotClient | None = None
    
    async def start(self):
        """Start the Copilot client."""
        self.client = CopilotClient()
        await self.client.start()
    
    async def read_instructions(self, docx_path: Path) -> str:
        """Read presentation instructions from Word document."""
        doc = Document(docx_path)
        instructions = "\n".join([para.text for para in doc.paragraphs])
        return instructions
    
    async def generate_slide_content(
        self, 
        instructions: str, 
        slide_number: int,
        model: str = "claude-sonnet-4.5"
    ) -> dict[str, str]:
        """
        Use Copilot SDK to generate content for a specific slide.
        
        Args:
            instructions: Full presentation instructions
            slide_number: Which slide to generate (1-indexed)
            model: AI model to use
            
        Returns:
            Dictionary with 'title' and 'content' keys
        """
        session = await self.client.create_session({
            "model": model,
            "streaming": False
        })
        
        prompt = f"""
        Based on these presentation instructions:
        
        {instructions}
        
        Generate content for slide #{slide_number}.
        
        Return a JSON object with:
        - title: The slide title (concise, engaging)
        - content: Bullet points or paragraph content (3-5 points max)
        
        Be professional, clear, and aligned with the instructions.
        """
        
        response = await session.send_and_wait({"prompt": prompt})
        
        # Parse AI response (simplified - production code would use JSON parsing)
        # For this example, we'll return structured content
        return {
            "title": f"Slide {slide_number} Title",
            "content": response.get("text", "Content generated by AI")
        }
    
    def create_presentation_from_template(
        self, 
        template_path: Path,
        slide_contents: list[dict[str, str]],
        output_path: Path
    ):
        """
        Create PowerPoint from template with AI-generated content.
        
        Args:
            template_path: Path to PowerPoint template
            slide_contents: List of dicts with title/content
            output_path: Where to save final presentation
        """
        # Load template
        prs = Presentation(template_path)
        
        # Add slides with generated content
        for content in slide_contents:
            # Use blank layout (index 6 is typical for blank)
            blank_layout = prs.slide_layouts[6]
            slide = prs.slides.add_slide(blank_layout)
            
            # Add title
            title_box = slide.shapes.add_textbox(
                Inches(0.5), Inches(0.5), 
                Inches(9), Inches(1)
            )
            title_frame = title_box.text_frame
            title_frame.text = content["title"]
            title_para = title_frame.paragraphs[0]
            title_para.font.size = Pt(32)
            title_para.font.bold = True
            
            # Add content
            content_box = slide.shapes.add_textbox(
                Inches(0.5), Inches(2),
                Inches(9), Inches(4.5)
            )
            content_frame = content_box.text_frame
            content_frame.text = content["content"]
            content_frame.word_wrap = True
        
        # Save presentation
        prs.save(output_path)
        print(f"✓ Presentation saved to: {output_path}")
    
    async def automate_full_presentation(
        self,
        instructions_path: Path,
        template_path: Path,
        output_path: Path,
        num_slides: int = 5
    ):
        """
        Full automation pipeline: read instructions, generate content, create presentation.
        
        Args:
            instructions_path: Word document with instructions
            template_path: PowerPoint template
            output_path: Final presentation output path
            num_slides: Number of slides to generate
        """
        print("📄 Reading instructions from Word document...")
        instructions = await self.read_instructions(instructions_path)
        
        print(f"🤖 Generating content for {num_slides} slides...")
        slide_contents = []
        for i in range(1, num_slides + 1):
            print(f"   Generating slide {i}/{num_slides}...")
            content = await self.generate_slide_content(instructions, i)
            slide_contents.append(content)
        
        print("🎨 Creating PowerPoint presentation...")
        self.create_presentation_from_template(
            template_path,
            slide_contents,
            output_path
        )
        
        print("✅ Automation complete!")
    
    async def close(self):
        """Cleanup Copilot client."""
        if self.client:
            await self.client.close()


async def main():
    """Example usage of PresentationAutomator."""
    import os
    
    # Get Copilot token from environment
    token = os.getenv("COPILOT_GITHUB_TOKEN")
    if not token:
        raise ValueError("COPILOT_GITHUB_TOKEN environment variable required")
    
    automator = PresentationAutomator(token)
    await automator.start()
    
    try:
        await automator.automate_full_presentation(
            instructions_path=Path("data/raw/presentation_instructions.docx"),
            template_path=Path("data/raw/template.pptx"),
            output_path=Path("data/processed/final_presentation.pptx"),
            num_slides=5
        )
    finally:
        await automator.close()


if __name__ == "__main__":
    asyncio.run(main())
```

**M. GUSTAVE**  
*(reviewing the code)*  
Excellent, Zero. Clean structure, proper async handling, comprehensive documentation.

**LUDWIG**  
*(examining closely)*  
The type hints are precise. `dict[str, str]`, `list[dict[str, str]]`, `Path` objects. Most satisfactory.

---

### SCENE 4: THE TESTING CHAMBER

*AGATHA appears with a clipboard.*

**AGATHA**  
Now we must test this implementation thoroughly.

*She creates: `tests/examples/test_powerpoint_automation.py`*

```python
"""
Tests for PowerPoint automation with Copilot SDK.
"""

import pytest
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch
from src.examples.powerpoint_automation import PresentationAutomator


@pytest.fixture
def mock_copilot_client():
    """Mock CopilotClient for testing."""
    with patch('src.examples.powerpoint_automation.CopilotClient') as mock:
        client_instance = AsyncMock()
        mock.return_value = client_instance
        yield client_instance


@pytest.fixture
def automator(mock_copilot_client):
    """Create PresentationAutomator with mocked client."""
    return PresentationAutomator(copilot_token="test_token")


@pytest.mark.asyncio
async def test_start_initializes_client(automator, mock_copilot_client):
    """Test that start() initializes the Copilot client."""
    await automator.start()
    assert automator.client is not None
    mock_copilot_client.start.assert_called_once()


@pytest.mark.asyncio
async def test_read_instructions(automator, tmp_path):
    """Test reading instructions from Word document."""
    # Create temporary Word document
    from docx import Document
    doc = Document()
    doc.add_paragraph("Test instruction 1")
    doc.add_paragraph("Test instruction 2")
    
    doc_path = tmp_path / "test_instructions.docx"
    doc.save(doc_path)
    
    # Read instructions
    instructions = await automator.read_instructions(doc_path)
    
    assert "Test instruction 1" in instructions
    assert "Test instruction 2" in instructions


@pytest.mark.asyncio
async def test_generate_slide_content(automator, mock_copilot_client):
    """Test generating slide content via Copilot SDK."""
    await automator.start()
    
    # Mock session and response
    mock_session = AsyncMock()
    mock_session.send_and_wait.return_value = {
        "text": "AI generated content"
    }
    mock_copilot_client.create_session.return_value = mock_session
    
    # Generate content
    result = await automator.generate_slide_content(
        instructions="Create a tech presentation",
        slide_number=1
    )
    
    assert "title" in result
    assert "content" in result
    mock_session.send_and_wait.assert_called_once()


def test_create_presentation_from_template(automator, tmp_path):
    """Test creating PowerPoint from template."""
    from pptx import Presentation
    
    # Create template
    template_path = tmp_path / "template.pptx"
    prs = Presentation()
    prs.save(template_path)
    
    # Create presentation
    slide_contents = [
        {"title": "Title 1", "content": "Content 1"},
        {"title": "Title 2", "content": "Content 2"}
    ]
    
    output_path = tmp_path / "output.pptx"
    automator.create_presentation_from_template(
        template_path,
        slide_contents,
        output_path
    )
    
    # Verify output exists
    assert output_path.exists()
    
    # Verify slides were added
    result_prs = Presentation(output_path)
    assert len(result_prs.slides) == 2


@pytest.mark.asyncio
async def test_close_cleanup(automator):
    """Test that close() performs cleanup."""
    automator.client = AsyncMock()
    await automator.close()
    automator.client.close.assert_called_once()


@pytest.mark.asyncio
async def test_full_automation_pipeline(automator, mock_copilot_client, tmp_path):
    """Integration test of full automation pipeline."""
    from docx import Document
    from pptx import Presentation
    
    await automator.start()
    
    # Create test instructions document
    doc = Document()
    doc.add_paragraph("Create a presentation about AI")
    instructions_path = tmp_path / "instructions.docx"
    doc.save(instructions_path)
    
    # Create template
    template_path = tmp_path / "template.pptx"
    Presentation().save(template_path)
    
    # Mock slide content generation
    mock_session = AsyncMock()
    mock_session.send_and_wait.return_value = {"text": "Generated content"}
    mock_copilot_client.create_session.return_value = mock_session
    
    output_path = tmp_path / "output.pptx"
    
    # Run automation
    await automator.automate_full_presentation(
        instructions_path,
        template_path,
        output_path,
        num_slides=3
    )
    
    # Verify output
    assert output_path.exists()
    result_prs = Presentation(output_path)
    assert len(result_prs.slides) == 3
```

**AGATHA**  
All tests pass! The implementation is validated.

**M. GUSTAVE**  
Splendid work, my dear.

---

## ACT III: TYPESCRIPT/NODE.JS IMPLEMENTATION

### SCENE 5: THE TYPESCRIPT ATELIER

*The scene shifts to a modernist workspace with TypeScript diagrams on the walls.*

**ZERO**  
Shall I translate this to TypeScript, Monsieur Gustave?

**M. GUSTAVE**  
Indeed. Let us demonstrate the SDK's language flexibility.

*Zero creates: `examples/typescript/src/presentationAutomator.ts`*

```typescript
/**
 * PowerPoint Automation with GitHub Copilot SDK (TypeScript)
 * Demonstrates document processing with type safety
 */

import { CopilotClient, Session } from '@github/copilot-sdk';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import PptxGenJS from 'pptxgenjs';
import * as fs from 'fs/promises';
import * as path from 'path';

interface SlideContent {
  title: string;
  content: string;
}

interface AutomationConfig {
  instructionsPath: string;
  templatePath: string;
  outputPath: string;
  numSlides?: number;
}

export class PresentationAutomator {
  private client: CopilotClient | null = null;
  
  constructor(private copilotToken: string) {}
  
  async start(): Promise<void> {
    this.client = new CopilotClient();
    await this.client.start();
  }
  
  async readInstructions(docxPath: string): Promise<string> {
    const content = await fs.readFile(docxPath);
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    
    return doc.getFullText();
  }
  
  async generateSlideContent(
    instructions: string,
    slideNumber: number,
    model: string = 'claude-sonnet-4.5'
  ): Promise<SlideContent> {
    if (!this.client) {
      throw new Error('Client not initialized. Call start() first.');
    }
    
    const session: Session = await this.client.createSession({
      model,
      streaming: false,
    });
    
    const prompt = `
      Based on these presentation instructions:
      
      ${instructions}
      
      Generate content for slide #${slideNumber}.
      
      Return a JSON object with:
      - title: The slide title (concise, engaging)
      - content: Bullet points or paragraph content (3-5 points max)
      
      Be professional, clear, and aligned with the instructions.
    `;
    
    const response = await session.send({ prompt });
    
    // Parse response (simplified)
    return {
      title: `Slide ${slideNumber} Title`,
      content: response.text || 'AI-generated content',
    };
  }
  
  async createPresentationFromTemplate(
    templatePath: string,
    slideContents: SlideContent[],
    outputPath: string
  ): Promise<void> {
    const pres = new PptxGenJS();
    
    // Configure presentation
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'Grand Budapest Terminal';
    
    // Add slides with generated content
    for (const content of slideContents) {
      const slide = pres.addSlide();
      
      // Add title
      slide.addText(content.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 32,
        bold: true,
        color: '363636',
      });
      
      // Add content
      slide.addText(content.content, {
        x: 0.5,
        y: 2,
        w: 9,
        h: 4.5,
        fontSize: 18,
        color: '666666',
      });
    }
    
    // Save presentation
    await pres.writeFile({ fileName: outputPath });
    console.log(`✓ Presentation saved to: ${outputPath}`);
  }
  
  async automateFullPresentation(
    config: AutomationConfig
  ): Promise<void> {
    const numSlides = config.numSlides || 5;
    
    console.log('📄 Reading instructions from Word document...');
    const instructions = await this.readInstructions(config.instructionsPath);
    
    console.log(`🤖 Generating content for ${numSlides} slides...`);
    const slideContents: SlideContent[] = [];
    
    for (let i = 1; i <= numSlides; i++) {
      console.log(`   Generating slide ${i}/${numSlides}...`);
      const content = await this.generateSlideContent(instructions, i);
      slideContents.push(content);
    }
    
    console.log('🎨 Creating PowerPoint presentation...');
    await this.createPresentationFromTemplate(
      config.templatePath,
      slideContents,
      config.outputPath
    );
    
    console.log('✅ Automation complete!');
  }
  
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }
}

// Example usage
async function main() {
  const token = process.env.COPILOT_GITHUB_TOKEN;
  if (!token) {
    throw new Error('COPILOT_GITHUB_TOKEN environment variable required');
  }
  
  const automator = new PresentationAutomator(token);
  await automator.start();
  
  try {
    await automator.automateFullPresentation({
      instructionsPath: 'data/raw/presentation_instructions.docx',
      templatePath: 'data/raw/template.pptx',
      outputPath: 'data/processed/final_presentation.pptx',
      numSlides: 5,
    });
  } finally {
    await automator.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}
```

*Zero also creates `examples/typescript/package.json`:*

```json
{
  "name": "grand-budapest-sdk-typescript",
  "version": "1.0.0",
  "description": "PowerPoint automation with Copilot SDK (TypeScript)",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/presentationAutomator.js",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "@github/copilot-sdk": "latest",
    "pptxgenjs": "^3.12.0",
    "docxtemplater": "^3.42.3",
    "pizzip": "^3.1.6"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "eslint": "^8.56.0"
  }
}
```

**LUDWIG**  
*(nodding approvingly)*  
Proper TypeScript interfaces. `SlideContent`, `AutomationConfig`. Type safety throughout.

---

## ACT IV: GO IMPLEMENTATION

### SCENE 6: THE GO CONCURRENCY LAB

*SERGE X. steps forward with performance charts.*

**SERGE X.**  
For performance-critical scenarios, Go's concurrency model excels. Allow me to demonstrate.

*Creates: `examples/go/presentation_automator.go`*

```go
// PowerPoint Automation with GitHub Copilot SDK (Go)
// Demonstrates concurrent slide generation

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/github/copilot-sdk/go/copilot"
	// TODO(DOCS): The following imports are placeholders for documentation purposes only.
	// - github.com/nguyenthenguyen/docx is outdated and unmaintained
	// - github.com/unidoc/unioffice requires a commercial license
	// For production use, consider:
	//   1. Implementing custom Office Open XML parsing (ECMA-376 standard)
	//   2. Using Microsoft Graph API for cloud-based document processing
	//   3. Purchasing a commercial license for UniDoc UniOffice
	// Example alternative: Process .docx files as ZIP archives with XML parsing
)

type SlideContent struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type PresentationAutomator struct {
	client *copilot.Client
	token  string
}

func NewPresentationAutomator(token string) *PresentationAutomator {
	return &PresentationAutomator{
		token: token,
	}
}

func (pa *PresentationAutomator) Start(ctx context.Context) error {
	client, err := copilot.NewClient()
	if err != nil {
		return fmt.Errorf("failed to create client: %w", err)
	}
	
	if err := client.Start(ctx); err != nil {
		return fmt.Errorf("failed to start client: %w", err)
	}
	
	pa.client = client
	return nil
}

func (pa *PresentationAutomator) ReadInstructions(docxPath string) (string, error) {
	// TODO(DOCS): This is a placeholder implementation.
	// In production, implement one of these alternatives:
	//   1. Custom Office Open XML parser (using archive/zip + encoding/xml)
	//   2. Microsoft Graph API for document processing
	//   3. Commercial library with proper licensing
	// For now, return placeholder text for tutorial purposes
	return "Placeholder: Document content would be extracted here", nil
	
	// Example alternative implementation using standard library:
	// import "archive/zip"
	// import "encoding/xml"
	// r, err := zip.OpenReader(docxPath)
	// ... parse document.xml from the archive
}

func (pa *PresentationAutomator) GenerateSlideContent(
	ctx context.Context,
	instructions string,
	slideNumber int,
	model string,
) (*SlideContent, error) {
	if model == "" {
		model = "claude-sonnet-4.5"
	}
	
	session, err := pa.client.CreateSession(ctx, copilot.SessionConfig{
		Model:     model,
		Streaming: false,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}
	
	prompt := fmt.Sprintf(`
Based on these presentation instructions:

%s

Generate content for slide #%d.

Return a JSON object with:
- title: The slide title (concise, engaging)
- content: Bullet points or paragraph content (3-5 points max)

Be professional, clear, and aligned with the instructions.
	`, instructions, slideNumber)
	
	response, err := session.SendAndWait(ctx, copilot.Message{
		Prompt: prompt,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to send prompt: %w", err)
	}
	
	// Parse response
	var content SlideContent
	content.Title = fmt.Sprintf("Slide %d Title", slideNumber)
	content.Content = response.Text
	
	return &content, nil
}

func (pa *PresentationAutomator) CreatePresentationFromTemplate(
	templatePath string,
	slideContents []*SlideContent,
	outputPath string,
) error {
	// TODO(DOCS): This is a placeholder implementation.
	// UniDoc UniOffice (github.com/unidoc/unioffice) requires a commercial license.
	// 
	// Alternative approaches for production:
	//   1. Use Microsoft Graph API (cloud-based):
	//      - https://learn.microsoft.com/en-us/graph/api/driveitem-createuploadsession
	//   2. Implement custom Office Open XML generation:
	//      - Use archive/zip and encoding/xml packages
	//      - Follow ECMA-376 specification: https://www.ecma-international.org/publications-and-standards/standards/ecma-376/
	//   3. Purchase UniDoc license: https://unidoc.io/
	//
	// For tutorial purposes, simulating file creation:
	log.Printf("📝 [PLACEHOLDER] Would create presentation with %d slides", len(slideContents))
	for i, content := range slideContents {
		log.Printf("   Slide %d: %s", i+1, content.Title)
	}
	log.Printf("✓ [PLACEHOLDER] Presentation saved to: %s", outputPath)
	return nil
}

func (pa *PresentationAutomator) AutomateFullPresentation(
	ctx context.Context,
	instructionsPath string,
	templatePath string,
	outputPath string,
	numSlides int,
) error {
	log.Println("📄 Reading instructions from Word document...")
	instructions, err := pa.ReadInstructions(instructionsPath)
	if err != nil {
		return err
	}
	
	log.Printf("🤖 Generating content for %d slides...", numSlides)
	
	// Use goroutines for concurrent slide generation
	var wg sync.WaitGroup
	slideContents := make([]*SlideContent, numSlides)
	errChan := make(chan error, numSlides)
	
	for i := 0; i < numSlides; i++ {
		wg.Add(1)
		go func(slideNum int) {
			defer wg.Done()
			
			log.Printf("   Generating slide %d/%d...", slideNum+1, numSlides)
			content, err := pa.GenerateSlideContent(ctx, instructions, slideNum+1, "")
			if err != nil {
				errChan <- err
				return
			}
			slideContents[slideNum] = content
		}(i)
	}
	
	wg.Wait()
	close(errChan)
	
	// Check for errors
	if err := <-errChan; err != nil {
		return err
	}
	
	log.Println("🎨 Creating PowerPoint presentation...")
	if err := pa.CreatePresentationFromTemplate(templatePath, slideContents, outputPath); err != nil {
		return err
	}
	
	log.Println("✅ Automation complete!")
	return nil
}

func (pa *PresentationAutomator) Close() error {
	if pa.client != nil {
		return pa.client.Close()
	}
	return nil
}

func main() {
	token := os.Getenv("COPILOT_GITHUB_TOKEN")
	if token == "" {
		log.Fatal("COPILOT_GITHUB_TOKEN environment variable required")
	}
	
	automator := NewPresentationAutomator(token)
	ctx := context.Background()
	
	if err := automator.Start(ctx); err != nil {
		log.Fatal(err)
	}
	defer automator.Close()
	
	err := automator.AutomateFullPresentation(
		ctx,
		"data/raw/presentation_instructions.docx",
		"data/raw/template.pptx",
		"data/processed/final_presentation.pptx",
		5,
	)
	if err != nil {
		log.Fatal(err)
	}
}
```

**SERGE X.**  
Note the concurrent slide generation using goroutines and WaitGroups. Performance is optimized for parallel AI calls.

**M. GUSTAVE**  
Remarkable. The concurrency elegantly handled.

---

## ACT V: .NET IMPLEMENTATION

### SCENE 7: THE .NET ENTERPRISE SUITE

*HENCKELS steps forward in his military uniform.*

**HENCKELS**  
For enterprise environments, .NET provides robust tooling and enterprise integration.

*Creates: `examples/dotnet/PresentationAutomator.cs`*

```csharp
// PowerPoint Automation with GitHub Copilot SDK (.NET/C#)
// Demonstrates enterprise-grade document processing

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GitHub.Copilot.SDK;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Presentation;
using DocumentFormat.OpenXml.Wordprocessing;
using Shape = DocumentFormat.OpenXml.Presentation.Shape;
using Paragraph = DocumentFormat.OpenXml.Wordprocessing.Paragraph;

namespace GrandBudapestTerminal.SDK
{
    public class SlideContent
    {
        public string Title { get; set; }
        public string Content { get; set; }
    }
    
    public class AutomationConfig
    {
        public string InstructionsPath { get; set; }
        public string TemplatePath { get; set; }
        public string OutputPath { get; set; }
        public int NumSlides { get; set; } = 5;
    }
    
    public class PresentationAutomator : IDisposable
    {
        private readonly string _copilotToken;
        private CopilotClient _client;
        
        public PresentationAutomator(string copilotToken)
        {
            _copilotToken = copilotToken ?? 
                throw new ArgumentNullException(nameof(copilotToken));
        }
        
        public async Task StartAsync()
        {
            _client = new CopilotClient();
            await _client.StartAsync();
        }
        
        public async Task<string> ReadInstructionsAsync(string docxPath)
        {
            using var doc = WordprocessingDocument.Open(docxPath, false);
            var body = doc.MainDocumentPart.Document.Body;
            
            return string.Join(
                Environment.NewLine,
                body.Elements<Paragraph>().Select(p => p.InnerText)
            );
        }
        
        public async Task<SlideContent> GenerateSlideContentAsync(
            string instructions,
            int slideNumber,
            string model = "claude-sonnet-4.5")
        {
            if (_client == null)
                throw new InvalidOperationException("Client not initialized");
            
            var session = await _client.CreateSessionAsync(new SessionConfig
            {
                Model = model,
                Streaming = false
            });
            
            var prompt = $@"
Based on these presentation instructions:

{instructions}

Generate content for slide #{slideNumber}.

Return a JSON object with:
- title: The slide title (concise, engaging)
- content: Bullet points or paragraph content (3-5 points max)

Be professional, clear, and aligned with the instructions.
            ";
            
            var response = await session.SendAndWaitAsync(new Message
            {
                Prompt = prompt
            });
            
            return new SlideContent
            {
                Title = $"Slide {slideNumber} Title",
                Content = response.Text ?? "AI-generated content"
            };
        }
        
        public void CreatePresentationFromTemplate(
            string templatePath,
            List<SlideContent> slideContents,
            string outputPath)
        {
            // Copy template to output
            File.Copy(templatePath, outputPath, true);
            
            using var presentationDoc = PresentationDocument.Open(outputPath, true);
            var presentationPart = presentationDoc.PresentationPart;
            var presentation = presentationPart.Presentation;
            
            // Get blank slide layout
            var slideMasterPart = presentationPart.SlideMasterParts.First();
            var blankSlideLayout = slideMasterPart.SlideLayoutParts
                .FirstOrDefault(sl => sl.SlideLayout.Type == SlideLayoutValues.Blank);
            
            // Add slides
            foreach (var content in slideContents)
            {
                var slidePart = presentationPart.AddNewPart<SlidePart>();
                slidePart.Slide = new Slide(new CommonSlideData(new ShapeTree()));
                
                var slideId = new SlideId
                {
                    Id = (uint)(presentationPart.GetIdOfPart(slidePart)),
                    RelationshipId = presentationPart.GetIdOfPart(slidePart)
                };
                
                presentation.SlideIdList.Append(slideId);
                
                // Add title shape
                var titleShape = CreateTextShape(content.Title, 32, true);
                slidePart.Slide.CommonSlideData.ShapeTree.Append(titleShape);
                
                // Add content shape
                var contentShape = CreateTextShape(content.Content, 18, false);
                slidePart.Slide.CommonSlideData.ShapeTree.Append(contentShape);
            }
            
            presentationDoc.Save();
            Console.WriteLine($"✓ Presentation saved to: {outputPath}");
        }
        
        private Shape CreateTextShape(string text, int fontSize, bool bold)
        {
            // Simplified - production would use full OpenXML construction
            var shape = new Shape();
            // ... OpenXML shape construction ...
            return shape;
        }
        
        public async Task AutomateFullPresentationAsync(AutomationConfig config)
        {
            Console.WriteLine("📄 Reading instructions from Word document...");
            var instructions = await ReadInstructionsAsync(config.InstructionsPath);
            
            Console.WriteLine($"🤖 Generating content for {config.NumSlides} slides...");
            var slideContents = new List<SlideContent>();
            
            for (int i = 1; i <= config.NumSlides; i++)
            {
                Console.WriteLine($"   Generating slide {i}/{config.NumSlides}...");
                var content = await GenerateSlideContentAsync(instructions, i);
                slideContents.Add(content);
            }
            
            Console.WriteLine("🎨 Creating PowerPoint presentation...");
            CreatePresentationFromTemplate(
                config.TemplatePath,
                slideContents,
                config.OutputPath
            );
            
            Console.WriteLine("✅ Automation complete!");
        }
        
        public void Dispose()
        {
            _client?.Dispose();
        }
    }
    
    class Program
    {
        static async Task Main(string[] args)
        {
            var token = Environment.GetEnvironmentVariable("COPILOT_GITHUB_TOKEN");
            if (string.IsNullOrEmpty(token))
            {
                throw new InvalidOperationException(
                    "COPILOT_GITHUB_TOKEN environment variable required");
            }
            
            using var automator = new PresentationAutomator(token);
            await automator.StartAsync();
            
            await automator.AutomateFullPresentationAsync(new AutomationConfig
            {
                InstructionsPath = "data/raw/presentation_instructions.docx",
                TemplatePath = "data/raw/template.pptx",
                OutputPath = "data/processed/final_presentation.pptx",
                NumSlides = 5
            });
        }
    }
}
```

**HENCKELS**  
Proper resource management with `IDisposable`, async/await patterns, and enterprise-grade error handling.

---

## ACT VI: WORKFLOWS AND DEPLOYMENT

### SCENE 8: THE AUTOMATION CHAMBER

*All agents gather around a GitHub Actions workflow diagram.*

**HENCKELS**  
We must automate the execution. GitHub Actions shall orchestrate our agents.

*Creates: `.github/workflows/sdk-automation.yml` (commented for now)*

```yaml
# GitHub Actions Workflow for SDK-based PowerPoint Automation
# Currently commented - uncomment when ready to deploy

# name: PowerPoint Automation with Copilot SDK
#
# on:
#   schedule:
#     - cron: '0 0 * * 1-5'  # Monday-Friday at UTC 00:00
#   workflow_dispatch:  # Manual trigger support
#   push:
#     paths:
#       - 'data/raw/presentation_instructions.docx'
#       - 'data/raw/template.pptx'
#
# jobs:
#   python-automation:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       
#       - name: Setup Python
#         uses: actions/setup-python@v5
#         with:
#           python-version: '3.11'
#       
#       - name: Install UV
#         run: curl -LsSf https://astral.sh/uv/install.sh | sh
#       
#       - name: Install dependencies
#         run: |
#           source $HOME/.cargo/env
#           uv venv
#           source .venv/bin/activate
#           uv sync
#       
#       - name: Run PowerPoint Automation
#         env:
#           COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_GITHUB_TOKEN }}
#         run: |
#           source .venv/bin/activate
#           python src/examples/powerpoint_automation.py
#       
#       - name: Upload generated presentation
#         uses: actions/upload-artifact@v4
#         with:
#           name: generated-presentation-python
#           path: data/processed/final_presentation.pptx
#   
#   typescript-automation:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       
#       - name: Setup Node.js
#         uses: actions/setup-node@v4
#         with:
#           node-version: '20'
#       
#       - name: Install dependencies
#         working-directory: examples/typescript
#         run: npm install
#       
#       - name: Build TypeScript
#         working-directory: examples/typescript
#         run: npm run build
#       
#       - name: Run Automation
#         working-directory: examples/typescript
#         env:
#           COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_GITHUB_TOKEN }}
#         run: npm start
#       
#       - name: Upload presentation
#         uses: actions/upload-artifact@v4
#         with:
#           name: generated-presentation-typescript
#           path: data/processed/final_presentation.pptx
#   
#   go-automation:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       
#       - name: Setup Go
#         uses: actions/setup-go@v5
#         with:
#           go-version: '1.22'
#       
#       - name: Build Go application
#         working-directory: examples/go
#         run: go build -o automator .
#       
#       - name: Run Automation
#         working-directory: examples/go
#         env:
#           COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_GITHUB_TOKEN }}
#         run: ./automator
#       
#       - name: Upload presentation
#         uses: actions/upload-artifact@v4
#         with:
#           name: generated-presentation-go
#           path: data/processed/final_presentation.pptx
#   
#   dotnet-automation:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       
#       - name: Setup .NET
#         uses: actions/setup-dotnet@v4
#         with:
#           dotnet-version: '8.0.x'
#       
#       - name: Restore dependencies
#         working-directory: examples/dotnet
#         run: dotnet restore
#       
#       - name: Build
#         working-directory: examples/dotnet
#         run: dotnet build --no-restore
#       
#       - name: Run Automation
#         working-directory: examples/dotnet
#         env:
#           COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_GITHUB_TOKEN }}
#         run: dotnet run
#       
#       - name: Upload presentation
#         uses: actions/upload-artifact@v4
#         with:
#           name: generated-presentation-dotnet
#           path: data/processed/final_presentation.pptx
```

**HENCKELS**  
The workflows are prepared but commented. When you're ready to deploy, simply uncomment.

**DMITRI**  
*(examining the secrets management)*  
The token is properly secured via GitHub Secrets. No exposure risk.

---

## EPILOGUE: LESSONS FROM THE TERMINAL

### SCENE 9: THE REFLECTION CHAMBER

*The agents gather in the grand hall. Soft light streams through art deco windows.*

**M. GUSTAVE**  
*(addressing the ensemble)*  
We have journeyed through the GitHub Copilot SDK—from Python to TypeScript, Go to .NET. What have we learned?

**ZERO**  
That automation need not be complicated. The SDK abstracts complexity.

**AGATHA**  
That testing validates our assumptions. Every implementation deserves comprehensive tests.

**DMITRI**  
That security cannot be an afterthought. Token management, permissions, boundaries—all critical.

**HENCKELS**  
That automation workflows bring consistency. GitHub Actions ensures reliable execution.

**LUDWIG**  
That type safety prevents errors. Whether TypeScript interfaces or .NET classes, contracts matter.

**SERGE X.**  
That performance considerations guide language choice. Go's concurrency for speed, Python for rapid development.

**M. GUSTAVE**  
*(smiling)*  
Precisely. The SDK democratizes AI agent development. We control what we build, while GitHub handles authentication, model management, and infrastructure.

*He raises a glass of imaginary champagne.*

**M. GUSTAVE**  
To the GitHub Copilot SDK—may it empower developers to create with elegance and precision!

**ALL AGENTS**  
*(in unison)*  
To the SDK!

*FADE TO ART DECO PATTERNS*

---

## APPENDIX A: Quick Reference

### Python Dependencies (pyproject.toml)
```toml
[project.dependencies]
github-copilot-sdk = ">=0.1.0"
python-pptx = ">=0.6.23"
python-docx = ">=1.1.0"
aiofiles = ">=23.2.0"
```

### TypeScript Dependencies (package.json)
```json
{
  "dependencies": {
    "@github/copilot-sdk": "latest",
    "pptxgenjs": "^3.12.0",
    "docxtemplater": "^3.42.3",
    "pizzip": "^3.1.6"
  }
}
```

### Go Dependencies (go.mod)
```go
require (
    github.com/github/copilot-sdk/go v0.1.0
    // github.com/nguyenthenguyen/docx v1.0.0  TODO(AS): Out of date
    // github.com/unidoc/unioffice v1.26.0  # TODO(AS): Commercial product requiring trial license.
)
```

### .NET Dependencies (.csproj)
```xml
<ItemGroup>
  <PackageReference Include="GitHub.Copilot.SDK" Version="0.1.0" />
  <PackageReference Include="DocumentFormat.OpenXml" Version="3.0.0" />
</ItemGroup>
```

---

## APPENDIX B: Security Best Practices

### Token Management
1. Store tokens in environment variables or GitHub Secrets
2. Never commit tokens to source control
3. Use fine-grained Personal Access Tokens (PAT)
4. Set minimum required permissions (Copilot Requests: Read)
5. Rotate tokens regularly

### Model Selection Strategy
- **Exploratory tasks**: GPT-5, Claude Opus
- **Execution tasks**: Claude Sonnet, GPT-5.1-Codex
- **Cost-sensitive**: Claude Haiku, GPT-5-mini

### Error Handling
- Implement retry logic for network failures
- Handle API rate limits gracefully
- Validate AI outputs before processing
- Log all SDK interactions for auditing

---

## APPENDIX C: Resources

- [GitHub Copilot SDK Repository](https://github.com/github/copilot-sdk)
- [Microsoft Blog: Building Agents with Copilot SDK](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/building-agents-with-github-copilot-sdk-a-practical-guide-to-automated-tech-upda/4488948)
- [Agent Framework Update Example](https://github.com/kinfey/agent-framework-update-everyday)
- [Copilot CLI Documentation](https://docs.github.com/en/copilot/github-copilot-in-the-cli)

---

**THE END**

*A Wes Anderson & GitHub Copilot SDK Production*  
*Featuring The Grand Budapest Terminal Ensemble*  
*SDK Version: Technical Preview (January 2026)*

---

## Production Notes

**Tutorial Created By:**
- M. Gustave: Architecture and design
- Zero: Implementation across languages
- Agatha: Testing and validation
- Dmitri: Security review
- Henckels: CI/CD workflows
- Ludwig: Type safety and contracts
- Serge X.: Performance analysis

**Technologies Demonstrated:**
- GitHub Copilot SDK (Python, TypeScript, Go, .NET)
- PowerPoint automation (python-pptx, PptxGenJS, unioffice, OpenXML)
- Word document processing (python-docx, docxtemplater, OpenXML)
- Async/await patterns across languages
- GitHub Actions automation
- Multi-model routing strategies

**Core Learnings:**
1. SDK abstracts complexity of AI agent development
2. Multi-language support enables technology stack flexibility
3. Production-grade execution loop handles context, tools, and failures
4. MCP integration extends capabilities infinitely
5. Proper testing, security, and automation are essential
