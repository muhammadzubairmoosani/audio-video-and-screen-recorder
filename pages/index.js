import styles from '../styles/Home.module.css'
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import React, { useState, useRef, useEffect } from 'react';


export default function Home() {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const createStreamRef = (stream, streamType) => {
    setStream(stream);

    recorderRef.current = new RecordRTC(stream, { type: streamType });
    recorderRef?.current?.startRecording();
  }

  const handleAudioRecording = async () => {
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    createStreamRef(audioStream, 'audio')
  };

  const handleScreenRecording = async () => {
    const videoStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true, video: { width: 1920, height: 1080, frameRate: 30, }
    });

    createStreamRef(videoStream, 'video')
  };

  const handleVideoRecording = async () => {
    const cameraStream = await navigator?.mediaDevices?.getUserMedia({ audio: true, video: true });

    createStreamRef(cameraStream, 'video')
  };

  const handleStop = () => {
    recorderRef?.current?.stopRecording(() => {
      setBlob(recorderRef?.current?.getBlob());
    });
  };

  const handleSave = () => {
    invokeSaveAsDialog(blob);
  };

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }
    // refVideo.current.srcObject = stream;
  }, [stream, refVideo]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.btn_group}>
          <div>
            <p>Audio Recording</p>
            <button className={styles.button} onClick={handleAudioRecording}>Start</button>
          </div>

          <div>
            <p>Screen Recording</p>
            <button className={styles.button} onClick={handleScreenRecording}>Start</button>
          </div>

          <div>
            <p>Video Recording</p>
            <button className={styles.button} onClick={handleVideoRecording}>Start</button>
          </div>
        </div>

        <div>
          <p>Actions</p>
          <button className={styles.button} onClick={handleStop}>Stop</button>
          <button className={styles.button} onClick={handleSave}>Save</button>
        </div>
      </header>

      <section>
        {/* VIDEO PLAYER */}
        {blob?.type?.includes('video') && (
          <video
            src={URL?.createObjectURL(blob)}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: '700px', margin: '1em' }}
          />
        )}

        {/* AUDIO PLAYER */}
        {blob?.type?.includes('audio') && (
          <audio
            controls
            src={URL?.createObjectURL(blob)}
            autoPlay
            ref={refVideo}
          />
        )}
      </section>
    </div>
  )
}
