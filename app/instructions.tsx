export default function Instructions({ buttonClicked }: { buttonClicked: boolean }) {
    
    return (
        <div style={{ minHeight: '24px' }}>
            { !buttonClicked && <p>Click play button to begin game</p> }
        </div>
    );
}
