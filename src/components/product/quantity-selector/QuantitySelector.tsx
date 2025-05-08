//'use client'

import React from 'react'
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5'

interface Props {
    quantity: number,
    onQuantityChanged: (value: number) => void,
}

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {
    //const [count, setCount] = useState(quantity)

    const onValueChanged = (value: number): void => {
        //if (count + value < 1) return
        //setCount(count + value)
        if (quantity + value < 1) return
        onQuantityChanged(quantity + value)
    }

    return (
        <div className='flex'>
            <button onClick={() => onValueChanged(-1)}>
                <IoRemoveCircleOutline size={30} />
            </button>
            <span className='w-20 mx-3 px-5 bg-gray-200 text-center rounded'>
                {/* {count} */}
                {quantity}
            </span>
            <button onClick={() => onValueChanged(+1)}>
                <IoAddCircleOutline size={30} />
            </button>
        </div>
    )
}
