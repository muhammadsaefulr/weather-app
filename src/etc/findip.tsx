// IPModule.ts

// Mendefinisikan fungsi untuk mendapatkan IP
export function getIPCount(callback: (ipCount: number) => void): void {
  // Membuat objek baru untuk koneksi WebRTC
  const RTCPeerConnection = window.RTCPeerConnection
  const pc = new RTCPeerConnection({iceServers: []});
  const noop = () => {};
  const localIPs: {[key: string]: boolean} = {};
  const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;

  // Fungsi untuk mengolah hasil koneksi WebRTC
  function handleCandidate(candidate: string): void {
    const match = ipRegex.exec(candidate);
    if (!match) {
      return;
    }
    localIPs[match[1]] = true;
  }

  // Mendapatkan IP lokal
  pc.createDataChannel('');

  // Mendapatkan kandidat untuk koneksi
  pc.createOffer((sdp) => {
    sdp.sdp?.split('\n').forEach((line) => {
      if (line.indexOf('candidate') === 0) {
        handleCandidate(line.split(' ')[4]);
      }
    });
    pc.setLocalDescription(sdp, noop, noop);
  }, noop);

  // Menunggu hasil koneksi
  pc.onicecandidate = (ice) => {
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) {
      return;
    }
    handleCandidate(ice.candidate.candidate);
  };

  // Menunda beberapa saat untuk memastikan koneksi telah selesai
  setTimeout(() => {
    const ipCount = Object.keys(localIPs).length;
    callback(ipCount);
    pc.close(); // Tutup koneksi
  }, 1000);
}
