// lib/audio-converter.ts
// Improved audio conversion with validation

export async function convertToWav(audioBlob: Blob): Promise<Blob> {
    console.log('🎵 Converting audio to WAV...');
    console.log('   Input size:', audioBlob.size, 'bytes');
    console.log('   Input type:', audioBlob.type);
    
    // Validate input
    if (audioBlob.size < 1000) {
      throw new Error('Audio file too small. Please record for at least 1 second.');
    }
    
    try {
      // Create audio context with target sample rate
      const audioContext = new AudioContext({ sampleRate: 16000 });
      
      // Decode the audio blob
      const arrayBuffer = await audioBlob.arrayBuffer();
      console.log('   Array buffer size:', arrayBuffer.byteLength);
      
      let audioBuffer: AudioBuffer;
      try {
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } catch (decodeError) {
        console.error('❌ Failed to decode audio:', decodeError);
        throw new Error('Failed to decode audio. Please check your microphone settings.');
      }
      
      console.log('   Decoded audio:');
      console.log('     Duration:', audioBuffer.duration, 'seconds');
      console.log('     Sample rate:', audioBuffer.sampleRate, 'Hz');
      console.log('     Channels:', audioBuffer.numberOfChannels);
      console.log('     Length:', audioBuffer.length, 'samples');
      
      // Validate audio duration
      if (audioBuffer.duration < 0.5) {
        throw new Error('Recording too short. Please speak for at least 1 second.');
      }
      
      // Convert to WAV
      const wavBlob = audioBufferToWav(audioBuffer);
      
      console.log('✅ WAV conversion complete');
      console.log('   Output size:', wavBlob.size, 'bytes');
      console.log('   Output type:', wavBlob.type);
      
      await audioContext.close();
      
      return wavBlob;
    } catch (error: any) {
      console.error('❌ Audio conversion error:', error);
      throw error;
    }
  }
  
  function audioBufferToWav(audioBuffer: AudioBuffer): Blob {
    const numberOfChannels = 1; // Force mono
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;
    
    // Get audio data (use first channel if stereo)
    const data = audioBuffer.getChannelData(0);
    const samples = new Int16Array(data.length);
    
    // Convert float32 samples to int16
    for (let i = 0; i < data.length; i++) {
      const s = Math.max(-1, Math.min(1, data[i]));
      samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    
    const dataLength = samples.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);
    
    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true); // PCM format
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true); // byte rate
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);
    
    // Write audio data
    const offset = 44;
    for (let i = 0; i < samples.length; i++) {
      view.setInt16(offset + i * 2, samples[i], true);
    }
    
    console.log('   WAV header written:');
    console.log('     Format: PCM');
    console.log('     Channels:', numberOfChannels);
    console.log('     Sample rate:', sampleRate, 'Hz');
    console.log('     Bit depth:', bitDepth);
    console.log('     Data size:', dataLength, 'bytes');
    
    return new Blob([buffer], { type: 'audio/wav' });
  }
  
  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  
  // Helper function to validate WAV format
  export function validateWavBlob(blob: Blob): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer || arrayBuffer.byteLength < 44) {
          resolve(false);
          return;
        }
        
        const view = new DataView(arrayBuffer);
        const riff = String.fromCharCode(
          view.getUint8(0),
          view.getUint8(1),
          view.getUint8(2),
          view.getUint8(3)
        );
        const wave = String.fromCharCode(
          view.getUint8(8),
          view.getUint8(9),
          view.getUint8(10),
          view.getUint8(11)
        );
        
        resolve(riff === 'RIFF' && wave === 'WAVE');
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(blob);
    });
  }