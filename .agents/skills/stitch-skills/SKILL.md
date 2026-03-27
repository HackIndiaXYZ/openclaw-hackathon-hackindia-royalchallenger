---
name: Google Stitch UI Designer
description: Skill for generating and editing UI designs using Google Stitch MCP.
---

# Google Stitch UI Designer Skill

This skill allows the agent to interact with the Google Stitch MCP server to generate modern, high-quality, and premium UI screens directly from text prompts. 

## Capabilities

1. **List Projects**: `mcp_StitchMCP_list_projects`
2. **Read Project Context**: `mcp_StitchMCP_get_project`
3. **List Screens**: `mcp_StitchMCP_list_screens`
4. **Generate Screens**: `mcp_StitchMCP_generate_screen_from_text`
5. **Edit Screens**: `mcp_StitchMCP_edit_screens`
6. **Generate Variants**: `mcp_StitchMCP_generate_variants`
7. **Create/Update Design Systems**: `mcp_StitchMCP_create_design_system`, `mcp_StitchMCP_update_design_system`
8. **Apply Design Systems**: `mcp_StitchMCP_apply_design_system`

## Usage Guidelines

- Always start by finding the relevant `projectId` via `list_projects`.
- When generating a screen natively with `generate_screen_from_text`, carefully structure the `prompt` to define layout, interactions, visual hierarchy, and exact color requests. Provide detailed prompts for the best results.
- Ensure any UI designed adheres to premium aesthetics, such as utilizing glassmorphism, appropriate contrast ratios (e.g. `surface-container-low`), and modern typography (e.g., Inter, Manrope).
- To pull down generated content (code or SVG snippets) to the workspace, you will need to utilize the components provided by the result of the text-to-screen functions.
