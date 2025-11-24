const { useState, useEffect, useRef } = React;

function UkulelePractice() {
  const allChords = ['C', 'Am', 'F', 'G', 'D', 'Em', 'A', 'Dm', 'D7', 'G7'];
  
  const [selectedChords, setSelectedChords] = useState(['C', 'Am', 'F', 'G']);
  const [currentChord, setCurrentChord] = useState('');
  const [nextChord, setNextChord] = useState('');
  const [bpm, setBpm] = useState(60);
  const [beatsPerChord, setBeatsPerChord] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  
  // Use ref to store next chord value for interval closure
  const nextChordRef = useRef('');

  // Timer for elapsed time
  useEffect(() => {
    let timerInterval;
    if (isPlaying) {
      timerInterval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isPlaying]);

  // Beat counter for metronome
  useEffect(() => {
    let beatInterval;
    if (isPlaying) {
      const beatDuration = 60000 / bpm; // milliseconds per beat
      
      setCurrentBeat(1); // Start at beat 1
      
      beatInterval = setInterval(() => {
        setCurrentBeat(prev => {
          if (prev >= 4) {
            return 1;
          }
          return prev + 1;
        });
      }, beatDuration);
    } else {
      setCurrentBeat(0);
    }
    return () => clearInterval(beatInterval);
  }, [isPlaying, bpm]);

  // Chord rotation based on BPM
  useEffect(() => {
    let chordInterval;
    if (isPlaying && selectedChords.length > 0) {
      // Calculate duration: (60000ms / BPM) * beats
      const durationMs = (60000 / bpm) * beatsPerChord;
      
      // Set initial chords
      const randomChord = selectedChords[Math.floor(Math.random() * selectedChords.length)];
      const randomNextChord = selectedChords[Math.floor(Math.random() * selectedChords.length)];
      setCurrentChord(randomChord);
      setNextChord(randomNextChord);
      nextChordRef.current = randomNextChord;
      
      chordInterval = setInterval(() => {
        // Move next chord (from ref) to current
        const chordToShow = nextChordRef.current;
        setCurrentChord(chordToShow);
        
        // Pick a new next chord
        const newNextChord = selectedChords[Math.floor(Math.random() * selectedChords.length)];
        setNextChord(newNextChord);
        nextChordRef.current = newNextChord;
      }, durationMs);
    }
    return () => clearInterval(chordInterval);
  }, [isPlaying, bpm, beatsPerChord, selectedChords]);

  const handleStart = () => {
    if (selectedChords.length === 0) {
      alert('Please select at least one chord!');
      return;
    }
    setIsPlaying(true);
    setElapsedTime(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentChord('');
    setNextChord('');
  };

  const toggleChord = (chord) => {
    setSelectedChords(prev => {
      if (prev.includes(chord)) {
        return prev.filter(c => c !== chord);
      } else {
        return [...prev, chord];
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        <a href="index.html" className="text-amber-600 hover:text-amber-800 mb-4 inline-block">&larr; Back</a>
        <h1 className="text-4xl font-bold text-center text-amber-900 mb-8">
          🎸 Ukulele Chord Practice
        </h1>

        {/* Current Chord Display */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 mb-8 text-center">
          {isPlaying ? (
            <>
              <div className="text-8xl font-bold text-amber-600 mb-2 animate-pulse">
                {currentChord}
              </div>
              
              {/* Next Chord Preview */}
              <div className="text-2xl text-gray-500 mb-6">
                Next: <span className="font-semibold text-gray-700">{nextChord}</span>
              </div>
              
              {/* Beat Indicator */}
              <div className="flex justify-center items-center gap-6 mb-6">
                {Array.from({ length: 4 }, (_, i) => {
                  const beatNum = i + 1;
                  const isActive = currentBeat === beatNum;
                  
                  return (
                    <div key={beatNum} className={`flex flex-col items-center transition-all duration-100 ${
                      isActive ? 'scale-125' : 'scale-100'
                    }`}>
                      <div className={`text-5xl font-bold ${
                        isActive ? 'text-amber-600' : 'text-gray-400'
                      }`}>
                        ↓
                      </div>
                      <div className={`text-lg font-semibold mt-1 ${
                        isActive ? 'text-amber-600' : 'text-gray-400'
                      }`}>
                        {beatNum}
                      </div>
                      <div className={`w-12 h-2 rounded-full mt-1 ${
                        isActive ? 'bg-amber-500' : 'bg-gray-300'
                      }`} />
                    </div>
                  );
                })}
              </div>
              
              <div className="text-3xl text-gray-600 font-mono">
                {formatTime(elapsedTime)}
              </div>
            </>
          ) : (
            <div className="text-4xl text-gray-400">
              Click Start to Begin
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
          
          {/* BPM Control */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              BPM: {bpm}
            </label>
            <input
              type="range"
              min="40"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>40</span>
              <span>200</span>
            </div>
          </div>

          {/* Beats per Chord */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Beats per Chord: {beatsPerChord}
            </label>
            <input
              type="range"
              min="1"
              max="16"
              value={beatsPerChord}
              onChange={(e) => setBeatsPerChord(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>1 beat</span>
              <span>16 beats</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Duration: {((60000 / bpm) * beatsPerChord / 1000).toFixed(1)} seconds
            </div>
          </div>

          {/* Chord Selection */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Select Chords to Practice:
            </label>
            <div className="flex flex-wrap gap-3">
              {allChords.map(chord => (
                <button
                  key={chord}
                  onClick={() => toggleChord(chord)}
                  disabled={isPlaying}
                  className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 ${
                    selectedChords.includes(chord)
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {chord}
                </button>
              ))}
            </div>
          </div>

          {/* Start/Stop Button */}
          <div className="flex justify-center">
            {!isPlaying ? (
              <button
                onClick={handleStart}
                className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                ▶ Start Practice
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="px-12 py-4 bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                ⏹ Stop
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> The downbeat arrows (↓) help you stay in rhythm. Strum when each beat 
            lights up! Start slow at 60 BPM and gradually increase. Try 4 beats per chord at first, 
            then reduce to 2 or 1 beat for a challenge.
          </p>
        </div>
      </div>
    </div>
  );
}
