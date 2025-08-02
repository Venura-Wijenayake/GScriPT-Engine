// src/utils/assembleScript.js

/**
 * Assembles a full script from the current node data.
 * Orders nodes vertically (by Y), formats content per node type.
 */
export function assembleScript(nodes, edges) {
  // Order nodes visually top to bottom
  const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y);

  let scriptParts = [];

  for (const node of sorted) {
    const { type, data, id } = node;
    const content = data?.result || data?.prompt || '';

    if (!content?.trim()) continue;

    const trimmed = content.trim();

    switch (type) {
      case 'title':
        scriptParts.push(`# 🎬 ${trimmed}\n`);
        break;

      case 'prompt':
        scriptParts.push(`🟢 **Prompt Idea**\n${trimmed}\n`);
        break;

      case 'gpt':
        scriptParts.push(`🤖 **AI Response**\n${data.result?.trim() || 'No output.'}\n`);
        break;

      case 'manualentry':
        scriptParts.push(`✍️ **Manual Entry**\n${trimmed}\n`);
        break;

      case 'textfile':
        scriptParts.push(`📄 **Source Snippet**\n"${trimmed}"\n`);
        break;

      case 'plotpoint':
        scriptParts.push(`📌 **Plot Point**\n${trimmed}\n`);
        break;

      case 'imagetag':
        scriptParts.push(`🖼️ **Image Cue**: ${trimmed}\n`);
        break;

      case 'outroprompt':
        scriptParts.push(`🔚 **Outro**\n${trimmed}\n`);
        break;

      default:
        // fallback
        scriptParts.push(`🟡 [Unknown Node: ${type}]\n${trimmed}\n`);
        break;
    }
  }

  return scriptParts.join('\n');
}
