// PCM Player AudioWorklet Processor
// Implements a ring buffer for smooth, continuous audio playback at 24kHz

class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // Buffer for 180 seconds of audio at 24kHz
    this.bufferSize = 24000 * 180;
    this.buffer = new Float32Array(this.bufferSize);
    this.writeIndex = 0;
    this.readIndex = 0;

    this.port.onmessage = (event) => {
      if (event.data.command === "endOfAudio") {
        // Clear the buffer on interruption
        this.readIndex = this.writeIndex;
        return;
      }
      // Incoming data is Int16 PCM
      const int16Samples = new Int16Array(event.data);
      this._enqueue(int16Samples);
    };
  }

  _enqueue(int16Samples) {
    for (let i = 0; i < int16Samples.length; i++) {
      // Convert Int16 to Float32 [-1.0, 1.0]
      const floatVal = int16Samples[i] / 32768;
      this.buffer[this.writeIndex] = floatVal;
      this.writeIndex = (this.writeIndex + 1) % this.bufferSize;

      // Handle overflow by advancing read pointer
      if (this.writeIndex === this.readIndex) {
        this.readIndex = (this.readIndex + 1) % this.bufferSize;
      }
    }
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const framesPerBlock = output[0].length;

    for (let frame = 0; frame < framesPerBlock; frame++) {
      // Output current sample (or silence if buffer empty)
      const sample =
        this.readIndex !== this.writeIndex
          ? this.buffer[this.readIndex]
          : 0.0;

      // Write to all output channels
      for (let channel = 0; channel < output.length; channel++) {
        output[channel][frame] = sample;
      }

      // Advance read pointer if we have data
      if (this.readIndex !== this.writeIndex) {
        this.readIndex = (this.readIndex + 1) % this.bufferSize;
      }
    }

    return true; // Keep processor alive
  }
}

registerProcessor("pcm-player-processor", PCMPlayerProcessor);
