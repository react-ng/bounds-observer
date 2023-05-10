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
        <BoundsObserver enabled={true} onBoundsChange={handleBoundsChange}>
            <div id="my-element">Content</div>
        </BoundsObserver>
    );
};
```

### Conditional Enabling

This example demonstrates how to enable and disable the `BoundsObserver` component using the `enabled` prop.

```tsx
import React, { useState } from 'react';
import { BoundsObserver } from '@react-ng/bounds-observer';

const MyComponent = () => {
    const [enabled, setEnabled] = useState(false);

    // This will be called only when the observer is enabled
    const handleBoundsChange = (bounds: DOMRect) => {
        console.log('Bounds changed:', bounds);
    };

    const toggleEnabled = () => {
        setEnabled(!enabled);
    };

    return (
        <div>
            <button onClick={toggleEnabled}>
                {enabled ? 'Disable' : 'Enable'} observer
            </button>
            <BoundsObserver enabled={enabled} onBoundsChange={handleBoundsChange}>
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

- `enabled: boolean`: Whether the observer should be enabled
- `onBoundsChange: (bounds: DOMRect) => void`: The callback function that will be invoked when the bounding client rect of the `BoundsObserver` component's child changes, but only when the observer is enabled. Additionally, this callback will be invoked on enabling, i.e. when the `enabled` property changes to `true` or the component is initialized with `enabled` being `true`. 

## License

Apache License 2.0
