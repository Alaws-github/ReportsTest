import { WhiteCircleIcon, RightArrow } from '../../Common/CustomIcons/index'
import './styles.css'

const CenterIcon = () => {
  return (
    <>
      <RightArrow
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: '11',
          fontSize: '4rem',
          color: '#34C197',
        }}
      />
      <WhiteCircleIcon
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: '10',
          fontSize: '7rem',
        }}
      />
    </>
  )
}

export default CenterIcon
