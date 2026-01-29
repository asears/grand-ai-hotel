# Removed Dependencies & Alternatives

> **Context:** Commercial and problematic dependencies removed from Grand Budapest Terminal  
> **Date:** January 28, 2026  
> **Impact:** Go examples only (tutorial code)

---

## 🚫 Removed Dependencies

### 1. UniDoc UniOffice (Go)

**Package:** `github.com/unidoc/unioffice`  
**Language:** Go  
**License:** Commercial (Proprietary)  
**Reason for Removal:** Requires paid license or trial subscription

**Previous Usage:**
```go
import "github.com/unidoc/unioffice/presentation"

ppt, err := presentation.Open(templatePath)
// ... create slides programmatically
```

**Status:** ⚠️ **Removed** - Replaced with placeholder comments in tutorial

---

### 2. nguyenthenguyen/docx (Go)

**Package:** `github.com/nguyenthenguyen/docx`  
**Language:** Go  
**License:** Unknown/Unspecified  
**Reason for Removal:** Unmaintained (last commit 2019), license unclear

**Previous Usage:**
```go
import "github.com/nguyenthenguyen/docx"

r, err := docx.ReadDocxFile(docxPath)
doc := r.Editable()
content := doc.GetContent()
```

**Status:** ⚠️ **Removed** - Replaced with TODO comments

---

## ✅ Alternative Solutions

### Option 1: Custom Office Open XML Parser (Recommended for Open Source)

**Cost:** Free (Open Source)  
**License:** Use your own (CC0-1.0, MIT, Apache-2.0, etc.)  
**Maintenance:** Your responsibility  
**Complexity:** Medium

#### Implementation for Word Documents (.docx)

```go
package main

import (
    "archive/zip"
    "encoding/xml"
    "io"
    "strings"
)

// Word document structure
type Document struct {
    XMLName xml.Name `xml:"document"`
    Body    Body     `xml:"body"`
}

type Body struct {
    Paragraphs []Paragraph `xml:"p"`
}

type Paragraph struct {
    Runs []Run `xml:"r"`
}

type Run struct {
    Text string `xml:"t"`
}

// ReadDocx reads text from a .docx file
func ReadDocx(path string) (string, error) {
    // Open the .docx file (it's a ZIP archive)
    r, err := zip.OpenReader(path)
    if err != nil {
        return "", err
    }
    defer r.Close()

    // Find document.xml inside the archive
    var documentFile *zip.File
    for _, f := range r.File {
        if f.Name == "word/document.xml" {
            documentFile = f
            break
        }
    }

    if documentFile == nil {
        return "", fmt.Errorf("document.xml not found")
    }

    // Read the document XML
    rc, err := documentFile.Open()
    if err != nil {
        return "", err
    }
    defer rc.Close()

    // Parse XML
    var doc Document
    decoder := xml.NewDecoder(rc)
    if err := decoder.Decode(&doc); err != nil {
        return "", err
    }

    // Extract text from paragraphs
    var sb strings.Builder
    for _, para := range doc.Body.Paragraphs {
        for _, run := range para.Runs {
            sb.WriteString(run.Text)
        }
        sb.WriteString("\n")
    }

    return sb.String(), nil
}
```

**Pros:**
- ✅ Free and open source
- ✅ No licensing issues
- ✅ Full control over implementation
- ✅ No external dependencies

**Cons:**
- ❌ Requires understanding Office Open XML format (ECMA-376)
- ❌ More code to maintain
- ❌ Limited to basic text extraction (complex formatting harder)

**Best For:** Projects that need basic document reading without commercial dependencies

---

### Option 2: Microsoft Graph API (Recommended for Cloud)

**Cost:** Free tier available (Azure account required)  
**License:** N/A (Cloud service)  
**Maintenance:** Microsoft  
**Complexity:** Medium

#### Implementation

```go
package main

import (
    "context"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    msgraphsdk "github.com/microsoftgraph/msgraph-sdk-go"
)

// ReadDocxFromOneDrive reads document from OneDrive via Graph API
func ReadDocxFromOneDrive(driveItemID string) (string, error) {
    // Create credential
    cred, err := azidentity.NewDefaultAzureCredential(nil)
    if err != nil {
        return "", err
    }

    // Create Graph client
    client, err := msgraphsdk.NewGraphServiceClientWithCredentials(
        cred, []string{"https://graph.microsoft.com/.default"},
    )
    if err != nil {
        return "", err
    }

    // Get document content
    content, err := client.Me().Drive().Items().
        ByDriveItemId(driveItemID).Content().Get(context.Background(), nil)
    if err != nil {
        return "", err
    }

    // Convert to Word and extract text
    // (Implementation using Graph API's conversion capabilities)
    
    return extractedText, nil
}
```

**Pros:**
- ✅ Official Microsoft support
- ✅ Handles complex documents
- ✅ No licensing fees for basic usage
- ✅ Cloud-based (scalable)

**Cons:**
- ❌ Requires Azure account
- ❌ Internet connectivity required
- ❌ May have usage limits/costs at scale
- ❌ More complex setup (authentication, permissions)

**Best For:** Cloud-native applications, enterprise environments with Azure

---

### Option 3: LibreOffice Headless (Server-side)

**Cost:** Free (Open Source - MPL 2.0)  
**License:** Mozilla Public License 2.0  
**Maintenance:** The Document Foundation  
**Complexity:** Low

#### Implementation

```go
package main

import (
    "fmt"
    "os/exec"
    "strings"
)

// ConvertDocxToText using LibreOffice headless
func ConvertDocxToText(docxPath string) (string, error) {
    // Convert .docx to .txt using LibreOffice
    cmd := exec.Command(
        "soffice",
        "--headless",
        "--convert-to", "txt",
        "--outdir", "/tmp",
        docxPath,
    )
    
    output, err := cmd.CombinedOutput()
    if err != nil {
        return "", fmt.Errorf("conversion failed: %w\n%s", err, output)
    }

    // Read the generated text file
    txtPath := strings.TrimSuffix(docxPath, ".docx") + ".txt"
    content, err := os.ReadFile(txtPath)
    if err != nil {
        return "", err
    }

    return string(content), nil
}
```

**Setup:**
```bash
# Install LibreOffice (Ubuntu/Debian)
sudo apt-get install libreoffice

# Windows (Chocolatey)
choco install libreoffice

# macOS (Homebrew)
brew install --cask libreoffice
```

**Pros:**
- ✅ Free and open source
- ✅ Supports many Office formats
- ✅ Battle-tested (widely used)
- ✅ Simple integration

**Cons:**
- ❌ Requires LibreOffice installation on server
- ❌ Slower than native libraries
- ❌ Spawns external process (overhead)
- ❌ Limited control over conversion

**Best For:** Server-side batch processing, simple text extraction

---

### Option 4: Purchase Commercial License

**Option 4a: UniDoc UniOffice**

**Cost:** $399/developer (perpetual), $149/year (subscription)  
**License:** Commercial  
**Website:** [unidoc.io](https://unidoc.io/)

```go
// Same code as before, but with valid license
import "github.com/unidoc/unioffice/presentation"

// Set license key
license.SetMeteredKey("your-license-key")

ppt, err := presentation.Open(templatePath)
// ... create slides
```

**Pros:**
- ✅ Professional support
- ✅ Full feature set
- ✅ Well-documented
- ✅ Actively maintained

**Cons:**
- ❌ Commercial license cost
- ❌ License management overhead
- ❌ Not suitable for open source projects

**Best For:** Commercial projects with budget

---

**Option 4b: Aspose.Words for Go**

**Cost:** Starting at $1,199/developer  
**License:** Commercial  
**Website:** [aspose.com](https://products.aspose.com/words/go/)

```go
import "github.com/aspose-words/aspose-words-go"

doc, _ := words.NewDocument("document.docx")
text := doc.GetText()
```

**Pros:**
- ✅ Enterprise-grade
- ✅ Complete feature set
- ✅ Professional support

**Cons:**
- ❌ Very expensive
- ❌ Commercial license required

**Best For:** Large enterprise projects

---

## 📊 Comparison Matrix

| Solution                  | Cost      | License    | Complexity | Features | Cloud? | Recommended For |
|---------------------------|-----------|------------|------------|----------|--------|-----------------|
| **Custom XML Parser**     | Free      | Your choice| Medium     | Basic    | No     | ⭐ Open source projects |
| **Microsoft Graph API**   | Free tier | N/A        | Medium     | Full     | Yes    | ⭐ Cloud applications |
| **LibreOffice Headless**  | Free      | MPL 2.0    | Low        | Good     | No     | Server-side batch |
| **UniDoc UniOffice**      | $399+     | Commercial | Low        | Full     | No     | Commercial projects |
| **Aspose.Words**          | $1,199+   | Commercial | Low        | Premium  | No     | Enterprise only |

---

## 🎯 Recommendations by Use Case

### For This Project (Grand Budapest Terminal)
**Recommended:** Custom XML Parser (Option 1)
- Open source project (CC0-1.0 license)
- Tutorial/educational purpose
- No budget for commercial licenses
- Full control over implementation

### For Production Applications

**Scenario 1: Simple text extraction, open source**
→ Use **Custom XML Parser** or **LibreOffice Headless**

**Scenario 2: Cloud-native application**
→ Use **Microsoft Graph API**

**Scenario 3: Commercial product with budget**
→ Purchase **UniDoc UniOffice** license

**Scenario 4: Enterprise with complex requirements**
→ Purchase **Aspose.Words** or use **Microsoft Graph API**

---

## 🔧 Implementation Status

### Current Tutorial Code (Updated)

The tutorial now includes:
- ✅ Placeholder comments explaining the issue
- ✅ References to this document for alternatives
- ✅ Example implementation suggestions
- ✅ No commercial dependencies

Example from `copilot-sdk-powerpoint-automation.md`:

```go
import (
    "github.com/github/copilot-sdk/go/copilot"
    // TODO(DOCS): The following imports are placeholders for documentation purposes only.
    // - github.com/nguyenthenguyen/docx is outdated and unmaintained
    // - github.com/unidoc/unioffice requires a commercial license
    // For production use, see REMOVED_DEPENDENCIES.md for alternatives
)

func (pa *PresentationAutomator) ReadInstructions(docxPath string) (string, error) {
    // TODO(DOCS): This is a placeholder implementation.
    // See REMOVED_DEPENDENCIES.md for production-ready alternatives:
    //   1. Custom Office Open XML parser (free, open source)
    //   2. Microsoft Graph API (cloud-based, official)
    //   3. LibreOffice headless (server-side conversion)
    return "Placeholder: Document content would be extracted here", nil
}
```

---

## 📚 Additional Resources

### Office Open XML Specification
- [ECMA-376 Standard](https://www.ecma-international.org/publications-and-standards/standards/ecma-376/)
- [OpenXML Developer Guide](https://learn.microsoft.com/en-us/office/open-xml/open-xml-sdk)
- [Office File Formats](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-offcrypto/3c34d72a-1a61-4b52-a893-196f9157f083)

### Microsoft Graph API
- [Graph API Documentation](https://learn.microsoft.com/en-us/graph/overview)
- [OneDrive File Access](https://learn.microsoft.com/en-us/graph/api/driveitem-get)
- [Microsoft Graph SDK for Go](https://github.com/microsoftgraph/msgraph-sdk-go)

### LibreOffice
- [LibreOffice Download](https://www.libreoffice.org/download/download/)
- [Headless Mode Guide](https://wiki.documentfoundation.org/Faq/General/002)

### Example Implementations
- [docx-go](https://github.com/guylaor/docx) - Simple Go docx library (MIT license)
- [unoconv](https://github.com/unoconv/unoconv) - Universal Office converter (GPL)

---

## 🔄 Migration Path

If you previously used the removed dependencies:

### Step 1: Remove Dependencies
```bash
cd examples/go
go mod edit -dropreplace github.com/unidoc/unioffice
go mod edit -dropreplace github.com/nguyenthenguyen/docx
go mod tidy
```

### Step 2: Choose Alternative (see recommendations above)

### Step 3: Implement Replacement
- Copy example code from this document
- Adapt to your specific use case
- Test thoroughly

### Step 4: Update Documentation
- Document which alternative you chose
- Add any specific setup requirements
- Update README if needed

---

## ❓ FAQ

**Q: Can I still use UniDoc if I have a license?**  
A: Yes! If you have a valid commercial license, you can use it in your private fork. This project just can't include it as a dependency for public distribution.

**Q: Why not use GPL-licensed alternatives?**  
A: GPL requires derivative works to also be GPL-licensed, which conflicts with our CC0-1.0 (public domain) license.

**Q: Is the custom XML parser production-ready?**  
A: The basic example is a starting point. For production, you'll need to handle more edge cases (formatting, embedded objects, etc.). See the ECMA-376 spec for details.

**Q: What about PowerPoint (.pptx) files?**  
A: Same alternatives apply. The custom XML parser approach works for both .docx and .pptx (both use Office Open XML format).

**Q: Can I contribute a better alternative?**  
A: Absolutely! If you have a better open-source solution, please submit a PR or open an issue.

---

**Maintained By:** M. Gustave (Architecture) & Ludwig (Validation)  
**Last Updated:** January 28, 2026  
**Related Documents:**
- [DEPENDENCIES.md](../DEPENDENCIES.md)
- [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md)
- [Tutorial](../tutorials/copilot-sdk-powerpoint-automation.md)
