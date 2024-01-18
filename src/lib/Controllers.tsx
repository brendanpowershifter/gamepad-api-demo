import React, { useState, useEffect, useRef } from 'react';

const GamepadButtons = () => {
  const [gamepadState, setGamepadState] = useState<Gamepad | null | undefined>(null);
  const requestRef = useRef();

  const handleGamepad = () => {
    // Check if the browser supports the Gamepad API
    if (!navigator.getGamepads) {
      console.error('Gamepad API not supported, please use a different browser.');
      return;
    }

    // Get the first gamepad (you can modify this logic based on your requirements)
    const gamepad = navigator.getGamepads()[0];
    // Update the state with the gamepad data
    setGamepadState(gamepad);

    requestAnimationFrame(handleGamepad);
  };

  useEffect(() => {
    // Add an event listener for the gamepadconnected event
    window.addEventListener('gamepadconnected', handleGamepad);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('gamepadconnected', handleGamepad);
      // Cancel the requestAnimationFrame when the component is unmounted
      cancelAnimationFrame(requestRef.current ?? 0);
    };
  }, []);

  const getAxesLabels = (index: number) => {
    switch (index) {
      case 0:
        return 'Left Stick X';
      case 1:
        return 'Left Stick Y';
      case 2:
        return 'Right Stick X';
      case 3:
        return 'Right Stick Y';
      default:
        return 'Unknown';
    }
  }

  const renderButtons = () => {
    if (!gamepadState) {
      return <p>No gamepad connected.</p>;
    }

    return (
      <div>
        <div className='buttons grid auto-cols-fr grid-rows-1 grid-flow-col gap-4 pb-10'>
          {gamepadState.buttons.map((button: GamepadButton, index) => (
            <div key={index} className='button data-[pressed="true"]:bg-green-300 flex flex-col justify-center items-center border rounded-md text-center' data-pressed={button.pressed || button.touched}>
              <span>{index + 1}</span> <span>{button.pressed || button.touched ? 'pressed' : 'not pressed'}</span>
            </div>
          ))}
        </div>
        {gamepadState.axes.map((axis: number, index) => (
          <div>
            <span>{getAxesLabels(index)}:</span> <span>{axis}</span>
            <progress key={index} className='w-full' value={axis + 1} max='2' />
          </div>
        ))}
      </div>)
  };

  return (
    <div className='p-10'>
      <h1 className='pb-10'>Gamepad Buttons</h1>
      {renderButtons()}
    </div>
  );
};

export default GamepadButtons;
