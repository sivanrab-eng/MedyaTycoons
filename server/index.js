const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const ROOMS_FILE = path.join(__dirname, "..", "rooms.json");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// ============ GAME DATA ============
const PUZZLES = [
  { id:1, topic:"Present Simple", creative_text:"The DJ ____ (play) music.", creative_hebrew:"התקליטן (מנגן) מוזיקה.", time_word:"Every night", visual_description:"🎧 תקליטן אחד בעמדה", options:["play","plays","is playing"], answer:"plays", tech_hint:"ה-DJ הוא He (הוא). בהרגל קבוע, מוסיפים S לפועל.", error_text:"ה-DJ משתעל ויוצאת לו תרנגולת מהפה! 🐔", success_text:"ה-DJ מרים ידיים! המוזיקה מקפיצה! 🎶", error_anim:"chicken_cough" },
  { id:2, topic:"Present Simple", creative_text:"We ____ (not / like) boring shows.", creative_hebrew:"אנחנו (לא אוהבים) מופעים משעממים.", time_word:"Always", visual_description:"👦👧👦 קבוצת ילדים מחייכת", options:["don't like","doesn't like","not like"], answer:"don't like", tech_hint:"עם We (אנחנו), השלילה היא תמיד Don't.", error_text:"הקהל מוציא כריות ונרדם! 😴💤", success_text:"הקהל קופץ מהכיסאות! 🎉", error_anim:"audience_snore" },
  { id:3, topic:"Present Progressive", creative_text:"The stars ____ (shine).", creative_hebrew:"הכוכבים (מנצנצים) עכשיו.", time_word:"Right now!", visual_description:"⭐⭐⭐ כוכבים רבים בשמיים", options:["shines","is shining","are shining"], answer:"are shining", tech_hint:"פעולה שקורה עכשיו + רבים (Stars) = Are + ing.", error_text:"הכוכבים נופלים מהשמיים כמו כדורי גומי! ⭐💥", success_text:"הכוכבים מנצנצים בזהב! ✨", error_anim:"falling_stars" },
  { id:4, topic:"Present Simple", creative_text:"He ____ (have) a new guitar.", creative_hebrew:"יש לו גיטרה חדשה.", time_word:"Today", visual_description:"🎸 ילד אחד מחזיק גיטרה", options:["have","has","haves"], answer:"has", tech_hint:"שימו לב! הפועל Have הופך ל-Has בגוף שלישי (He/She).", error_text:"הגיטרה הופכת למחבט טניס! 🎾😂", success_text:"הגיטרה מנגנת סולו מטורף! 🎸🔥", error_anim:"guitar_tennis" },
  { id:5, topic:"Present Progressive", creative_text:"I ____ (dance) on stage.", creative_hebrew:"אני (רוקד) על הבמה עכשיו.", time_word:"At the moment", visual_description:"💃 דמות מצביעה על עצמה", options:["is dancing","am dancing","dance"], answer:"am dancing", tech_hint:"עם I (אני) תמיד משתמשים ב-Am.", error_text:"הרקדן מתחיל לרקוד ב-Lag ומתפרק! 🤖⚡", success_text:"ריקוד מושלם! הקהל משתגע! 💃🕺", error_anim:"robot_glitch" },
  { id:6, topic:"Present Simple", creative_text:"____ she (sing) well?", creative_hebrew:"האם היא (שרה) טוב?", time_word:"Usually", visual_description:"🎤 בחורה אחת עם מיקרופון", options:["Do","Does","Is"], answer:"Does", tech_hint:"בשאלה על She (היא), מתחילים עם Does.", error_text:"המיקרופון הופך לבננה! 🍌😂", success_text:"הזמרת שרה נפלא! 🎵👏", error_anim:"mic_banana" },
  { id:7, topic:"Past Simple", creative_text:"The band ____ (go) home.", creative_hebrew:"הלהקה (הלכה) הביתה אתמול.", time_word:"Yesterday", visual_description:"🎵 להקה הולכת הצידה", options:["go","goes","went"], answer:"went", tech_hint:"זה פועל מורד! בעבר, Go הופך ל-Went.", error_text:"השעון מסתובב אחורה בטירוף! ⏰🌀", success_text:"הלהקה נעלמת בסטייל! 🎸✌️", error_anim:"time_rewind" },
  { id:8, topic:"Past Simple", creative_text:"They ____ (watch) the movie.", creative_hebrew:"הם (צפו) בסרט בשבוע שעבר.", time_word:"Last week", visual_description:"🍿 קבוצה עם פופקורן", options:["watch","watched","watching"], answer:"watched", tech_hint:"פועל רגיל בעבר? פשוט מוסיפים ED בסוף.", error_text:"הפופקורן מתפוצץ לכל הכיוונים! 🍿💥", success_text:"סרט מצוין! הקהל מוחא כפיים! 🎬👏", error_anim:"popcorn_explosion" },
  { id:9, topic:"Past Simple", creative_text:"I ____ (not / see) you.", creative_hebrew:"לא (ראיתי) אותך אתמול.", time_word:"Yesterday", visual_description:"👀 דמות מבולבלת", options:["didn't see","didn't saw","not saw"], answer:"didn't see", tech_hint:"אחרי ה-Didn't הפועל חוזר להיות רגיל (V1)!", error_text:"הדמות הופכת לשקופה! רק הבגדים נשארים! 👻", success_text:"הדמות מופיעה בזוהר! 🌟", error_anim:"invisible_hero" },
  { id:10, topic:"Present Simple", creative_text:"My fans ____ (love) me.", creative_hebrew:"המעריצים שלי (אוהבים) אותי.", time_word:"Always", visual_description:"❤️ קהל עם לבבות", options:["love","loves","is love"], answer:"love", tech_hint:"מעריצים זה רבים (They), לכן הפועל נשאר רגיל.", error_text:"המעריצים בוכים! מזרקות דמעות! 😭💦", success_text:"המעריצים שולחים לבבות! ❤️❤️❤️", error_anim:"fan_crying_funny" }
];

const ROLES_BY_COUNT = {
  2: ["creative", "tech"],
  3: ["creative", "tech", "visual"],
  4: ["creative", "tech", "visual", "sound"]
};

// ============ ROOM PERSISTENCE ============
function saveRooms() {
  try {
    const data = {};
    for (const [code, room] of Object.entries(rooms)) {
      data[code] = {
        code: room.code,
        playerCount: room.playerCount,
        players: room.players,
        state: room.state,
        currentPuzzle: room.currentPuzzle,
        likes: room.likes,
        attempts: room.attempts,
        highFives: Array.from(room.highFives || []),
        createdAt: room.createdAt || Date.now()
      };
    }
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save rooms:", e.message);
  }
}

function loadRooms() {
  try {
    if (!fs.existsSync(ROOMS_FILE)) return;
    const data = JSON.parse(fs.readFileSync(ROOMS_FILE, "utf8"));
    const now = Date.now();
    const MAX_AGE = 2 * 60 * 60 * 1000; // 2 hours
    for (const [code, room] of Object.entries(data)) {
      if (now - (room.createdAt || 0) > MAX_AGE) continue; // skip expired
      rooms[code] = {
        ...room,
        highFives: new Set(room.highFives || []),
        puzzles: PUZZLES
      };
    }
    console.log(`Loaded ${Object.keys(rooms).length} rooms from disk`);
  } catch (e) {
    console.error("Failed to load rooms:", e.message);
  }
}

// ============ ROOM MANAGEMENT ============
const rooms = {};
const disconnectTimers = {};
const DISCONNECT_GRACE_MS = 20000;

function createRoom(code, playerCount) {
  rooms[code] = {
    code,
    playerCount,
    players: [],
    state: "waiting",
    currentPuzzle: 0,
    likes: 0,
    attempts: 0,
    highFives: new Set(),
    puzzles: PUZZLES,
    createdAt: Date.now()
  };
  saveRooms();
  return rooms[code];
}

function getRoom(code) {
  return rooms[code] || null;
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return rooms[code] ? generateCode() : code;
}

// ============ SOCKET HANDLERS ============
io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);
  let currentRoom = null;

  socket.on("CREATE_ROOM", ({ nickname, playerCount }, callback) => {
    const code = generateCode();
    const room = createRoom(code, playerCount);
    const player = { id: socket.id, nickname, role: null };
    room.players.push(player);
    socket.join(code);
    currentRoom = code;
    callback({ success: true, code, player });
    saveRooms();
    console.log(`Room ${code} created by ${nickname}`);
  });

  socket.on("JOIN_ROOM", ({ code, nickname }, callback) => {
    const room = getRoom(code);
    if (!room) return callback({ success: false, error: "חדר לא נמצא" });

    // Check if this is a reconnecting player (same nickname)
    const existing = room.players.find(p => p.nickname === nickname);
    if (existing) {
      // Cancel any pending disconnect timer
      const timerKey = `${code}:${nickname}`;
      if (disconnectTimers[timerKey]) {
        clearTimeout(disconnectTimers[timerKey]);
        delete disconnectTimers[timerKey];
        console.log(`Reconnect timer cancelled for ${nickname} in ${code}`);
      }
      // Update socket id and clear disconnected flag
      const oldId = existing.id;
      existing.id = socket.id;
      existing.disconnected = false;
      socket.join(code);
      currentRoom = code;

      io.to(code).emit("PLAYER_RECONNECTED", { players: room.players, playerId: socket.id, nickname });

      // Send full state so reconnecting player can resume
      const statePayload = {
        success: true, reconnected: true, player: existing,
        players: room.players, playerCount: room.playerCount,
        gameState: room.state, puzzleIndex: room.currentPuzzle, likes: room.likes
      };
      if (room.state === "playing" && room.puzzles[room.currentPuzzle]) {
        statePayload.puzzle = room.puzzles[room.currentPuzzle];
      }
      callback(statePayload);
      saveRooms();
      console.log(`${nickname} reconnected to room ${code}`);
      return;
    }

    // New player joining
    if (room.state !== "waiting") return callback({ success: false, error: "המשחק כבר התחיל" });
    if (room.players.length >= room.playerCount) return callback({ success: false, error: "החדר מלא" });

    const player = { id: socket.id, nickname, role: null };
    room.players.push(player);
    socket.join(code);
    currentRoom = code;

    io.to(code).emit("ROOM_UPDATE", {
      players: room.players,
      playerCount: room.playerCount
    });

    callback({ success: true, player, players: room.players, playerCount: room.playerCount });
    saveRooms();
    console.log(`${nickname} joined room ${code}`);
  });

  socket.on("START_GAME", ({ code }) => {
    const room = getRoom(code);
    if (!room || room.players.length < 2) return;

    const roles = ROLES_BY_COUNT[room.playerCount] || ROLES_BY_COUNT[2];
    room.players.forEach((p, i) => {
      p.role = roles[i] || roles[roles.length - 1];
    });
    room.state = "playing";
    room.currentPuzzle = 0;
    room.likes = 0;
    room.attempts = 0;

    io.to(code).emit("GAME_STARTED", {
      players: room.players,
      puzzle: room.puzzles[0],
      puzzleIndex: 0
    });
    console.log(`Game started in room ${code}`);
    saveRooms();
  });

  socket.on("SUBMIT_ANSWER", ({ code, answer }) => {
    const room = getRoom(code);
    if (!room || room.state !== "playing") return;

    const puzzle = room.puzzles[room.currentPuzzle];
    const correct = answer === puzzle.answer;
    room.attempts++;

    if (correct) {
      room.likes += 100;

      io.to(code).emit("ANSWER_RESULT", {
        correct: true,
        text: puzzle.success_text,
        answer: puzzle.answer,
        likes: room.likes,
        attempts: room.attempts
      });

      // After delay, advance
      setTimeout(() => {
        const nextIndex = room.currentPuzzle + 1;

        if (nextIndex >= room.puzzles.length) {
          room.state = "ended";
          io.to(code).emit("GAME_ENDED", { likes: room.likes, players: room.players });
          saveRooms();
        } else if (nextIndex % 3 === 0) {
          room.state = "highfive";
          room.highFives = new Set();
          io.to(code).emit("HIGH_FIVE_TIME", { puzzlesDone: nextIndex, likes: room.likes });
          saveRooms();
        } else {
          room.currentPuzzle = nextIndex;
          room.attempts = 0;
          io.to(code).emit("NEXT_PUZZLE", {
            puzzle: room.puzzles[nextIndex],
            puzzleIndex: nextIndex,
            likes: room.likes
          });
          saveRooms();
        }
      }, 2500);
    } else {
      io.to(code).emit("ANSWER_RESULT", {
        correct: false,
        text: puzzle.error_text,
        anim: puzzle.error_anim,
        attempts: room.attempts
      });
    }
  });

  socket.on("HIGH_FIVE", ({ code }) => {
    const room = getRoom(code);
    if (!room || room.state !== "highfive") return;

    room.highFives.add(socket.id);
    io.to(code).emit("HIGH_FIVE_UPDATE", {
      count: room.highFives.size,
      total: room.players.length
    });

    const activePlayers = room.players.filter(p => !p.disconnected);
    if (room.highFives.size >= activePlayers.length) {
      room.state = "playing";
      room.currentPuzzle++;
      room.attempts = 0;
      room.highFives = new Set();

      setTimeout(() => {
        io.to(code).emit("NEXT_PUZZLE", {
          puzzle: room.puzzles[room.currentPuzzle],
          puzzleIndex: room.currentPuzzle,
          likes: room.likes
        });
      }, 800);
      saveRooms();
    }
  });

  socket.on("disconnect", () => {
    if (currentRoom) {
      const room = getRoom(currentRoom);
      if (room) {
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          // Mark as disconnected but don't remove yet
          player.disconnected = true;
          const timerKey = `${currentRoom}:${player.nickname}`;
          const roomRef = currentRoom;

          io.to(currentRoom).emit("PLAYER_AWAY", {
            players: room.players,
            playerId: socket.id,
            nickname: player.nickname
          });
          console.log(`Player ${player.nickname} went away from room ${currentRoom} (grace period started)`);

          // Grace period - remove player after timeout if they don't reconnect
          disconnectTimers[timerKey] = setTimeout(() => {
            delete disconnectTimers[timerKey];
            const r = getRoom(roomRef);
            if (r) {
              r.players = r.players.filter(p => p.nickname !== player.nickname);
              io.to(roomRef).emit("PLAYER_LEFT", {
                players: r.players,
                nickname: player.nickname
              });
              if (r.players.length === 0) {
                delete rooms[roomRef];
                console.log(`Room ${roomRef} deleted (empty)`);
              }
              saveRooms();
              console.log(`Player ${player.nickname} removed from ${roomRef} after grace period`);
            }
          }, DISCONNECT_GRACE_MS);
        }
      }
    }
    console.log(`Player disconnected: ${socket.id}`);
  });
});

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Media Tycoons Server Running", rooms: Object.keys(rooms).length, uptime: process.uptime() });
});

app.get("/ping", (req, res) => {
  res.json({ ok: true, rooms: Object.keys(rooms).length });
});

const PORT = process.env.PORT || 3001;
loadRooms();
server.listen(PORT, () => {
  console.log(`🎬 Media Tycoons server running on port ${PORT}`);
});
