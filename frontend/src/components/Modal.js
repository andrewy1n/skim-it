import React, { useRef } from 'react'
import '../css/Modal.css'

function Modal({ open, onClose, title, tldr, content }) {
    const modalRef = useRef();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    if(!open) { return null; }
    return (
        <div ref={modalRef} onClick={closeModal} className='overlay'>
            <div className='modalContainer'>
                <div className='modalHeader'>
                    <h1>{title}</h1>
                    <p onClick={onClose} className='closeButton'>X</p>
                </div>
                <br />
                <div className='modalContent'>
                    <img className='images'
                    src={'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png'}
                    alt={'lebron my baby'}
                    ></img>
                    <br />
                    <div>{tldr}</div>
                    <br />
                    <div>{content}</div>  <br />
                    <div className="gradient-blur"></div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
                
            </div>
        </div>
    );
}

export default Modal;
