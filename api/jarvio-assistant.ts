
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, taskContext, subtasks, currentSubtaskIndex, conversationHistory } = req.body;

    // Call the Supabase edge function
    const response = await fetch(`https://aojrdgobdavxjpnymskc.supabase.co/functions/v1/jarvio-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvanJkZ29iZGF2eGpwbnltc2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTI1MTAsImV4cCI6MjA1NTk2ODUxMH0.wMoKqcb8N_r5xqLmLwhwHgjzvp-MautqCzsOxNzmucs'}`
      },
      body: JSON.stringify({
        message,
        taskContext,
        subtasks,
        currentSubtaskIndex,
        conversationHistory
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in jarvio-assistant proxy:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
