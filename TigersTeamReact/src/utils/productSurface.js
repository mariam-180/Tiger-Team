// Bespoke circuit artwork: vector lines remain crisp at every screen size.
const circuit = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">
  <defs>
    <linearGradient id="red" x1="1600" y1="0" x2="700" y2="900" gradientUnits="userSpaceOnUse"><stop stop-color="#f12446" stop-opacity=".85"/><stop offset="1" stop-color="#8b102e" stop-opacity=".05"/></linearGradient>
    <linearGradient id="steel" x1="1550" y1="150" x2="700" y2="800" gradientUnits="userSpaceOnUse"><stop stop-color="#8d8d9d" stop-opacity=".24"/><stop offset="1" stop-color="#41414e" stop-opacity=".02"/></linearGradient>
  </defs>
  <path d="M1640 -140H1240Q1110 -140 1110 0V90Q1110 200 1000 200H960Q850 200 850 310V410Q850 530 970 530H1200Q1300 530 1300 650V720Q1300 820 1410 820H1660" stroke="url(#steel)" stroke-width="112"/>
  <path d="M1640 -140H1240Q1110 -140 1110 0V90Q1110 200 1000 200H960Q850 200 850 310V410Q850 530 970 530H1200Q1300 530 1300 650V720Q1300 820 1410 820H1660" stroke="#08090e" stroke-width="108"/>
  <path d="M1640 -140H1240Q1110 -140 1110 0V90Q1110 200 1000 200H960Q850 200 850 310V410Q850 530 970 530H1200Q1300 530 1300 650V720Q1300 820 1410 820H1660" stroke="#818190" stroke-opacity=".13" stroke-width="1" stroke-dasharray="14 20"/>
  <path d="M1610 8H1310Q1170 8 1170 140V180Q1170 260 1060 260H980Q910 260 910 340V395" stroke="url(#red)" stroke-width="5"/>
  <path d="M1500 940L1720 720M1460 940L1720 680M1420 940L1720 640" stroke="url(#red)" stroke-width="20"/>
  <path d="M1100 60H1200M1100 72H1180M1100 84H1160M740 590H860M740 602H820" stroke="#b7b7c7" stroke-opacity=".15" stroke-width="2"/>
  <circle cx="910" cy="395" r="7" fill="#dc2c49"/><circle cx="910" cy="395" r="18" stroke="#dc2c49" stroke-opacity=".4"/>
</svg>`;
const productSurface = {
  backgroundColor: '#090a0f',
  backgroundImage: [
    `url("data:image/svg+xml,${encodeURIComponent(circuit)}")`,
    'radial-gradient(ellipse at 95% 10%, rgba(135,17,42,0.24), transparent 48%)',
    'linear-gradient(115deg, #090a0f 15%, #111019 65%, #0a0a10)',
  ].join(', '),
  backgroundSize: '1600px 1000px, cover, cover',
  backgroundPosition: 'right top, center, center',
  backgroundRepeat: 'no-repeat',
};
export default productSurface;
