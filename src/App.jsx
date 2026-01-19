import { useEffect, useState } from 'react'



/* ---------- Hotel Initialization ---------- */
const initHotel = () => {
  const floors = [];
  for (let f = 1; f <= 10; f++) {
    const roomsCount = f === 10 ? 7 : 10;
    const rooms = [];
    for (let r = 1; r <= roomsCount; r++) {
      rooms.push({
        id: `${f}-${r}`,
        floor: f,
        index: r,
        roomNo: f * 100 + r,
        occupied: false,
      });
    }
    floors.push(rooms);
  }
  return floors;
};

/* ---------- Travel Time ---------- */
const travelTime = (a, b) => {
  const vertical = Math.abs(a.floor - b.floor) * 2;
  const horizontal = Math.abs(a.index - b.index);
  return vertical + horizontal;
};

export default function App() {
  const [hotel, setHotel] = useState([]);
  const [roomsToBook, setRoomsToBook] = useState("");

  useEffect(() => {
    setHotel(initHotel());
  }, []);

  /* ---------- Reset ---------- */
  const reset = () => setHotel(initHotel());

  /* ---------- Random Occupancy ---------- */
  const randomize = () => {
    setHotel(prev =>
      prev.map(f =>
        f.map(r => ({ ...r, occupied: Math.random() < 0.3 }))
      )
    );
  };

  /* ---------- Booking Logic ---------- */
  const bookRooms = () => {
    const n = Number(roomsToBook);
    if (n < 1 || n > 5) {
      alert("You can book 1–5 rooms only");
      return;
    }

    /* 1️⃣ Same-floor priority */
    for (const floor of hotel) {
      const free = floor.filter(r => !r.occupied);
      if (free.length >= n) {
        const selected = free.slice(0, n);
        commitBooking(selected);
        return;
      }
    }

    /* 2️⃣ Cross-floor booking (min travel time) */
    const available = hotel.flat().filter(r => !r.occupied);
    if (available.length < n) {
      alert("Not enough rooms available");
      return;
    }

    let best = null;
    let minCost = Infinity;

    for (let i = 0; i <= available.length - n; i++) {
      const group = available.slice(i, i + n);
      let cost = 0;

      for (let j = 0; j < group.length - 1; j++) {
        cost += travelTime(group[j], group[j + 1]);
      }

      if (cost < minCost) {
        minCost = cost;
        best = group;
      }
    }

    commitBooking(best);
  };

  /* ---------- Apply Booking ---------- */
  const commitBooking = (rooms) => {
    setHotel(prev =>
      prev.map(f =>
        f.map(r =>
          rooms.some(b => b.id === r.id)
            ? { ...r, occupied: true }
            : r
        )
      )
    );
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl text-red font-bold mb-4">
        Hotel Room Reservation System
      </h1>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <input
          type="number"
          placeholder="No of Rooms"
          value={roomsToBook}
          onChange={e => setRoomsToBook(e.target.value)}
          className="border px-3 py-1 w-40 rounded"
        />
        <button onClick={bookRooms} className="border px-4 py-1">
          Book
        </button>
        <button onClick={reset} className="border px-4 py-1">
          Reset
        </button>
        <button onClick={randomize} className="border px-4 py-1">
          Random
        </button>
      </div>

      {/* Layout */}
      <div className="flex">
        {/* Lift */}
        <div className="w-20 border h-[420px] flex items-center justify-center font-bold">
          Lift
        </div>

        {/* Rooms */}
        <div className="ml-4 flex flex-col-reverse gap-2">
          {hotel.map((floor, i) => (
            <div key={i} className="flex gap-2">
              {floor.map(room => (
                <div
                  key={room.id}
                  className={`w-8 h-8 border flex items-center justify-center text-xs
                    ${room.occupied ? "bg-gray-500 text-white" : "bg-white"}
                  `}
                >
                  {room.roomNo}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
