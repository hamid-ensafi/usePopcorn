
import './style.css'
import { useState } from "react";
import PropTypes from 'prop-types'

const contentStyle = {
    display: 'flex',
    gap: '5px',
    height: '50px',
    width: 'max-content',
    alignItems:'center'
}

App.propTypes={
    size:PropTypes.number,
    color:PropTypes.string,
    className:PropTypes.string,
    Length:PropTypes.number,
    defaultRating:PropTypes.number,
    message:PropTypes.array,
}
function App({size=25,color='#aaa',className='test',Length=5,onSetRating,defaultRating=0,message=[]}) {
    const TextStyle={
        display: 'block',
        width: `${size}px`,
        height: `${size}px`,
        cursor: 'pointer',
        color,
        
    }
   
    const [rating, setRating] = useState(defaultRating)
    const [onRating, setOnRating] = useState(0)

    function handleClick(index) {
        setRating(index)
        onSetRating(index)
    }

    return (
        <div className={className} onMouseLeave={() => setOnRating(0)} style={contentStyle}>
            {Array.from({ length: Length }, (_, i) => <Star onHoverin={() => setOnRating(i + 1)} TextStyle={TextStyle} full={onRating ? onRating >= i + 1 : rating >= i + 1} key={i} index={i} onSelect={() => handleClick(i + 1)}>{i + 1}</Star>)}
            {/* <p style={{color:TextStyle.color}}>{onRating || rating || ''}</p> */}
            <p style={{color:TextStyle.color}}> {Length==message.length?message[onRating ? onRating-1:rating-1]:onRating || rating || ''}</p>
        </div>
    )
}

function Star({ onSelect, full, onHoverin,TextStyle }) {
    return (

        <span style={TextStyle} onMouseEnter={onHoverin} onClick={onSelect}>
            {full ? <svg width='100%' height='100%' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={TextStyle.color}><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path></svg>
                : <svg  width='100%' height='100%' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z">
                    </path>
                </svg>}
        </span>

    )
}

export default App 