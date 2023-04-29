# bounds-observer

A React wrapper for the [`@html-ng/bounding-client-rect-observer`](https://www.npmjs.com/package/@html-ng/bounding-client-rect-observer) library, providing a React component that observes changes in the bounding client rect of its child.

## Installation

```
npm install @react-ng/bounds-observer
```

## Examples

### Basic Example

This example demonstrates how to use the `BoundsObserver` component to observe an element's bounding client rect.

```tsx
import React from 'react';
import { BoundsObserver } from '@react-ng/bounds-observer';

const MyComponent = () => {
    const handleBoundsChange = (bounds: DOMRect) => {
        console.log('Bounds changed:', bounds);
    };

    return (
        <BoundsObserver activate={true} onBoundsChange={handleBoundsChange}>
            <div id="my-element">Content</div>
        </BoundsObserver>
    );
};
```

### Conditional Activation

This example demonstrates how to activate and deactivate the `BoundsObserver` component using the `activate` prop.

```tsx
import React, { useState } from 'react';
import { BoundsObserver } from '@react-ng/bounds-observer';

const MyComponent = () => {
    const [activate, setActivate] = useState(false);

    // This will be called only when the observer is active
    const handleBoundsChange = (bounds: DOMRect) => {
        console.log('Bounds changed:', bounds);
    };

    const toggleActivate = () => {
        setActivate(!activate);
    };

    return (
        <div>
            <button onClick={toggleActivate}>
                {activate ? 'Deactivate' : 'Activate'} observer
            </button>
            <BoundsObserver activate={activate} onBoundsChange={handleBoundsChange}>
                <div id="my-element">Content</div>
            </BoundsObserver>
        </div>
    );
};
```

## API Documentation

### `BoundsObserver`

The React component for observing changes in the bounding client rect of its child. It accepts a single child.

Properties:

- `activate: boolean`: Whether the observer should be active
- `onBoundsChange: (bounds: DOMRect) => void`: The callback function that will be invoked when the bounding client rect of the `BoundsObserver` component's child changes, but only when the observer is active

## License

Apache License 2.0
