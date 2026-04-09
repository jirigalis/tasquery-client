import { Task } from '../models/task.model';

export type ExportPlatform = 'jira' | 'slack' | 'markdown' | 'plain';

/**
 * Transforms Task to platform-specific Markdown/Text strings.
 */
export function formatForPlatform(task: Task, platform: ExportPlatform): string {
    const body = task.content;
    const title = task.title.toUpperCase();
    const metadata = `Priority: ${task.priority}${task.tags?.length ? ' | Tags: #' + task.tags.join(' #') : ''}`;

    switch (platform) {
        case 'slack':
            // Slack MD syntax (bold: *, italic: _, code: `)
            return `*${title}*\n_${metadata}_\n\n` +
                body.replace(/^### (.*$)/gm, '*$1*')
                    .replace(/\*\*(.*?)\*\*/g, '*$1*') // Převod MD bold (**) na Slack bold (*)
                    .replace(/- \[( |x)\] (.*$)/gm, '• $2')
                    .replace(/^- (.*$)/gm, '• $1');

        case 'jira':
        case 'markdown':
            // Standardní Markdown (GitHub / Jira Cloud)
            return `### ${title}\n**${metadata}**\n\n${body}`;

        case 'plain':
        default:
            return `${title}\n${metadata}\n\n` +
                body.replace(/[#*`]/g, '').replace(/- \[( |x)\] /g, '- ');
    }
}

export function wrapInHtml(text: string, platform: ExportPlatform): string {
    const bt = '\x60'; // Hex kód pro back-tick

    // 0. ESCAPING: Nejdříve převedeme speciální znaky na entity
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 1. Bloky kódu: Odstraníme název jazyka a zabalíme
    const codeBlockRegex = new RegExp(`${bt}${bt}${bt}(?:[a-z]+)?\\n?([\\s\\S]*?)${bt}${bt}${bt}`, 'g');
    html = html.replace(codeBlockRegex, '<pre style="background-color: #f6f8fa; padding: 12px; border-radius: 4px; font-family: monospace; white-space: pre;"><code>$1</code></pre>');

    // 2. Inline kód
    const inlineCodeRegex = new RegExp(`${bt}(.*?)${bt}`, 'g');
    html = html.replace(inlineCodeRegex, '<code style="background-color: rgba(27,31,35,0.05); padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>');

    // 3. Formátování textu
    if (platform === 'slack') {
        html = html
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>');
    } else {
        html = html
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>');
    }

    // 4. Seznamy
    html = html
        .replace(/^• (.*$)/gm, '<li>$1</li>')
        .replace(/^- (.*$)/gm, '<li>$1</li>');

    // Najdeme bloky po sobě joducích <li> a zabalíme je do <ul>
    html = html.replace(/((?:<li>.*?<\/li>[\s]*)+)/gms, (match) => {
        const cleanedItems = match.trim().replace(/\n/g, '');
        return `<ul>${cleanedItems}</ul>`;
    });

    // 5. Finální vyčištění nadbytečných mřížek
    html = html.replace(/^### /gm, '');

    // 6. Sanitizace whitespace kolem blokových elementů (FIX pro Jiru)
    html = html
        .replace(/(<\/h3>)\n+/g, '$1')
        .replace(/(<\/ul>)\n+/g, '$1')
        .replace(/\n+(<ul>)/g, '$1')
        .replace(/\n+(<pre)/g, '$1')
        .replace(/(<\/pre>)\n+/g, '$1');

    // 7. Konce řádků (zachování formátování v <pre>)
    const preBlocks: string[] = [];
    html = html.replace(/<pre[\s\S]*?<\/pre>/g, (match) => {
        preBlocks.push(match);
        return `__PRE_BLOCK_${preBlocks.length - 1}__`;
    });

    html = html.replace(/\n/g, '<br>');

    html = html.replace(/__PRE_BLOCK_(\d+)__/g, (_, index) => preBlocks[parseInt(index)]);

    return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family: sans-serif; font-size: 14px; line-height: 1.5;">${html}</body></html>`;
}
