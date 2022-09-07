const Pulse = ({ color }) => (
  <span
    style={{
      display: 'flex',
      width: 10,
      height: 10,
      position: 'absolute',
      top: 0,
      right: 0,
      marginTop: -1,
      marginRight: -1,
    }}
  >
    <span
      className="animate-ping"
      style={{
        position: 'absolute',
        display: 'inline',
        borderRadius: '9999px',
        width: 10,
        height: 10,
        opacity: 75,
        backgroundColor: color,
      }}
    />
    <span
      className="animate-ping"
      style={{
        position: 'relative',
        display: 'inline',
        borderRadius: '9999px',
        width: 10,
        height: 10,
        backgroundColor: color,
      }}
    />
  </span>
)

export default Pulse
