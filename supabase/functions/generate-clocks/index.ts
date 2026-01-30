import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY')
const XAI_API_KEY = Deno.env.get('XAI_API_KEY')
const DASHSCOPE_API_KEY = Deno.env.get('DASHSCOPE_API_KEY')
const MOONSHOT_API_KEY = Deno.env.get('MOONSHOT_API_KEY')

interface ModelConfig {
	provider: string
	modelId: string
	displayName: string
}

const MODELS: ModelConfig[] = [
	{ provider: 'openai', modelId: 'gpt-3.5-turbo', displayName: 'GPT-3.5' },
	{ provider: 'openai', modelId: 'gpt-4o', displayName: 'GPT-4o' },
	{ provider: 'openai', modelId: 'gpt-5', displayName: 'GPT-5' },
	{ provider: 'anthropic', modelId: 'claude-3-5-haiku-latest', displayName: 'Haiku 3.5' },
	{ provider: 'google', modelId: 'gemini-2.5-flash-preview-05-20', displayName: 'Gemini 2.5' },
	{ provider: 'deepseek', modelId: 'deepseek-chat', displayName: 'DeepSeek V3.1' },
	{ provider: 'xai', modelId: 'grok-4', displayName: 'Grok 4' },
	{ provider: 'alibaba', modelId: 'qwen-max', displayName: 'Qwen 2.5' },
	{ provider: 'moonshot', modelId: 'kimi-k2-0711-preview', displayName: 'Kimi K2' }
]

function getTimeString(): string {
	const now = new Date()
	const hours = now.getHours()
	const minutes = now.getMinutes()
	const ampm = hours >= 12 ? 'PM' : 'AM'
	const displayHours = hours % 12 || 12
	return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

function getTimeForDb(): string {
	const now = new Date()
	return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`
}

function buildPrompt(time: string): string {
	return `Create HTML/CSS of an analog clock showing ${time}. Include numbers (or numerals) if you wish, and have a CSS animated second hand. Make it responsive and use a white background. Return ONLY the HTML/CSS code with no markdown formatting.`
}

async function callOpenAI(modelId: string, prompt: string): Promise<string> {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: modelId,
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 2000
		})
	})
	const data = await response.json()
	return data.choices?.[0]?.message?.content ?? ''
}

async function callAnthropic(modelId: string, prompt: string): Promise<string> {
	const response = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': ANTHROPIC_API_KEY!,
			'anthropic-version': '2023-06-01'
		},
		body: JSON.stringify({
			model: modelId,
			max_tokens: 2000,
			messages: [{ role: 'user', content: prompt }]
		})
	})
	const data = await response.json()
	return data.content?.[0]?.text ?? ''
}

async function callGoogle(modelId: string, prompt: string): Promise<string> {
	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GOOGLE_API_KEY}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: { maxOutputTokens: 2000 }
			})
		}
	)
	const data = await response.json()
	return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function callDeepSeek(modelId: string, prompt: string): Promise<string> {
	const response = await fetch('https://api.deepseek.com/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${DEEPSEEK_API_KEY}`
		},
		body: JSON.stringify({
			model: modelId,
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 2000
		})
	})
	const data = await response.json()
	return data.choices?.[0]?.message?.content ?? ''
}

async function callXAI(modelId: string, prompt: string): Promise<string> {
	const response = await fetch('https://api.x.ai/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${XAI_API_KEY}`
		},
		body: JSON.stringify({
			model: modelId,
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 2000
		})
	})
	const data = await response.json()
	return data.choices?.[0]?.message?.content ?? ''
}

async function callAlibaba(modelId: string, prompt: string): Promise<string> {
	const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${DASHSCOPE_API_KEY}`
		},
		body: JSON.stringify({
			model: modelId,
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 2000
		})
	})
	const data = await response.json()
	return data.choices?.[0]?.message?.content ?? ''
}

async function callMoonshot(modelId: string, prompt: string): Promise<string> {
	const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${MOONSHOT_API_KEY}`
		},
		body: JSON.stringify({
			model: modelId,
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 2000
		})
	})
	const data = await response.json()
	return data.choices?.[0]?.message?.content ?? ''
}

async function generateClock(model: ModelConfig, prompt: string): Promise<{ html: string; timeMs: number }> {
	const start = Date.now()
	let html = ''

	try {
		switch (model.provider) {
			case 'openai':
				html = await callOpenAI(model.modelId, prompt)
				break
			case 'anthropic':
				html = await callAnthropic(model.modelId, prompt)
				break
			case 'google':
				html = await callGoogle(model.modelId, prompt)
				break
			case 'deepseek':
				html = await callDeepSeek(model.modelId, prompt)
				break
			case 'xai':
				html = await callXAI(model.modelId, prompt)
				break
			case 'alibaba':
				html = await callAlibaba(model.modelId, prompt)
				break
			case 'moonshot':
				html = await callMoonshot(model.modelId, prompt)
				break
		}
	} catch (error) {
		console.error(`Error generating clock for ${model.displayName}:`, error)
		html = `<div style="padding:20px;text-align:center;color:#999;">Error generating clock</div>`
	}

	// Clean up markdown code blocks if present
	html = html
		.replace(/```html\n?/gi, '')
		.replace(/```\n?/g, '')
		.replace(/^html\n?/gi, '')
		.trim()

	return { html, timeMs: Date.now() - start }
}

Deno.serve(async _req => {
	try {
		const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

		const timeString = getTimeString()
		const timeForDb = getTimeForDb()
		const prompt = buildPrompt(timeString)

		// Generate all clocks in parallel
		const results = await Promise.all(
			MODELS.map(async model => {
				const { html, timeMs } = await generateClock(model, prompt)
				return {
					model_name: model.displayName,
					provider: model.provider,
					html_content: html,
					time_shown: timeForDb,
					generation_time_ms: timeMs
				}
			})
		)

		// Insert all clocks into database
		const { error } = await supabase.from('clocks').insert(results)

		if (error) {
			console.error('Error inserting clocks:', error)
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			})
		}

		return new Response(
			JSON.stringify({
				success: true,
				time: timeString,
				count: results.length
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		)
	} catch (error) {
		console.error('Unexpected error:', error)
		return new Response(JSON.stringify({ error: String(error) }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		})
	}
})
