import React, { useRef } from 'react'
import '../css/Modal.css'

function Modal({ open, onClose, title }) {
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
                <p onClick={onClose} className='closeButton'>X</p>
                <h1> {title} </h1> <br />
                <div>IMAGE</div> <br />
                <div>TDLR</div> <br />
                <div>ARTICLE</div>
            </div>
        </div>
    );
}

export default Modal;
