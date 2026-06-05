const { GoogleGenerativeAI } = require('@google/generative-ai');
const MusicModel = require('../models/music_models');
const UserModel = require('../models/user_models');

async function chatRecommendation(req, res) {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // 1. Fetch available songs to provide as context
        const songs = await MusicModel.find().populate('artist', 'username');
        const songContextList = songs.map(s => ({
            id: s._id,
            title: s.title,
            artist: s.artist?.username || 'Unknown Artist',
            uri: s.uri
        }));

        // Get user details
        const user = await UserModel.findById(req.user.id);
        const username = user ? user.username : 'Music Lover';

        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            try {
                // Initialize the Gemini API client
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


                // Construct system context prompt
                const systemPrompt = `You are Melodix AI, an enthusiastic, friendly music recommendation assistant for the Melodix Music Web App.
You are chatting with the user: ${username}.
The library has the following tracks:
${JSON.stringify(songContextList, null, 2)}

Instructions:
1. Suggest tracks *only* from the above list that match the user's mood, genre request, or description.
2. If none match exactly, suggest one or two of the available tracks anyway, telling them it's the latest in the library.
3. Be conversational and concise. Keep responses under 4 sentences.
4. Crucially, when recommending a song, format it exactly like this in your response: "[Song Title] by [Artist] (ID: [id])". The frontend will detect this pattern and render a direct Play button for it. Do not alter the ID format.

User message: ${message}`;

                const result = await model.generateContent(systemPrompt);
                const reply = result.response.text();

                return res.status(200).json({
                    reply,
                    songs: songContextList
                });
            } catch (geminiError) {
                console.error("Gemini API error, falling back to local recommender:", geminiError);
                // Fall through to local fallback
            }
        }

        // 2. Local fallback rule-based matching engine
        const lowercaseMessage = message.toLowerCase();
        let recommendedSongs = [];
        let mood = "general";

        if (lowercaseMessage.includes("happy") || lowercaseMessage.includes("party") || lowercaseMessage.includes("dance") || lowercaseMessage.includes("upbeat")) {
            mood = "happy/party";
            // Grab some songs
            recommendedSongs = songContextList.slice(0, 3);
        } else if (lowercaseMessage.includes("sad") || lowercaseMessage.includes("relax") || lowercaseMessage.includes("chill") || lowercaseMessage.includes("sleep")) {
            mood = "chill/sad";
            recommendedSongs = songContextList.slice(Math.max(0, songContextList.length - 2));
        } else if (lowercaseMessage.includes("workout") || lowercaseMessage.includes("gym") || lowercaseMessage.includes("energetic") || lowercaseMessage.includes("run")) {
            mood = "energetic";
            recommendedSongs = songContextList.filter((_, idx) => idx % 2 === 0).slice(0, 2);
        } else {
            // Default: pick up to 2 songs
            recommendedSongs = songContextList.slice(0, 2);
        }

        let reply = "";
        if (songContextList.length === 0) {
            reply = `Hi ${username}! I'd love to recommend some music, but our library is currently empty. If you log in as an Artist, you can upload some awesome tunes!`;
        } else if (recommendedSongs.length === 0) {
            // fallback if filter yielded empty
            recommendedSongs = [songContextList[0]];
        }

        if (songContextList.length > 0) {
            reply = `Hi ${username}! Based on your request, I think you'll love these tracks from our library:\n\n` +
                recommendedSongs.map(s => `- "${s.title}" by ${s.artist} (ID: ${s.id})`).join("\n") +
                `\n\nClick the Play button next to the songs to enjoy! Let me know if you want to hear something else.`;
        }

        return res.status(200).json({
            reply,
            songs: songContextList
        });

    } catch (error) {
        return res.status(500).json({ message: "Chatbot server error", error: error.message });
    }
}

module.exports = { chatRecommendation };
