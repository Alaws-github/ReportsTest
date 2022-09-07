import { Spin } from 'antd'

export const Spinner = () => {
    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                minWidth: '100%',
                width: '100%',
            }}
        >
            <Spin
            />
        </div>
    )
};