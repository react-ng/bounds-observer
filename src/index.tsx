import React, {ReactNode} from "react";
import {BoundingClientRectObserver} from "@html-ng/bounding-client-rect-observer";

interface BoundsObserverProps {
    readonly activate: boolean;

    readonly onBoundsChange: (bounds: DOMRect) => void;

    readonly children: ReactNode;
}

export class BoundsObserver extends React.Component<BoundsObserverProps, {}> {
    private _observer: BoundingClientRectObserver | null = null;

    private _root = React.createRef<HTMLDivElement>()

    constructor(props: BoundsObserverProps) {
        super(props);
    }

    componentDidMount() {
        const root = this._root.current;

        if (!root) {
            throw new Error("Reference should have been set by the time the component is mounted");
        }

        this._observer = this._observe({
            root,
            activate: this.props.activate,
        });
    }

    componentDidUpdate(
        prevProps: Readonly<BoundsObserverProps>,
        prevState: Readonly<{}>,
        snapshot?: any,
    ) {
        const oldObserver = this._observer;

        if (!oldObserver) {
            throw new Error(`Observer should have been installed by the time the component is updated`);
        }

        const root = this._root.current;

        if (!root) {
            throw new Error("Reference should have been set by the time the component is updated");
        }

        /**
         * Handle the potential change of callbacks
         *
         * @returns The new current bounds observer
         */
        const handleCallbackUpdate = (): BoundingClientRectObserver => {
            if (
                this.props.onBoundsChange != prevProps.onBoundsChange
            ) {
                oldObserver.disconnect();

                const newObserver = this._observe({
                    root,
                    // Ensure that the new observer is active, if the previous one was
                    activate: prevProps.activate,
                });

                this._observer = newObserver;

                return newObserver;
            } else {
                return oldObserver;
            }
        }

        const currentObserver = handleCallbackUpdate();

        if (
            this.props.activate != prevProps.activate
        ) {
            if (this.props.activate) {
                currentObserver.observe(root);
            } else {
                currentObserver.disconnect();
            }
        }
    }

    componentWillUnmount() {
        const observer = this._observer;

        if (!observer) {
            throw new Error("Observer should have been installed by the time the component is unmounted");
        }

        observer.disconnect();
    }

    render() {
        return (
            <div ref={this._root}>
                {this.props.children}
            </div>
        )
    }

    _observe(args: {
        root: Element,
        activate: boolean,
    }): BoundingClientRectObserver {
        const {root, activate} = args;

        const observer = new BoundingClientRectObserver((entries) => {
            // In practice, in our case there should always be one entry, and the target should be root
            entries.forEach((entry) => {
                if (entry.target === root) {
                    this.props.onBoundsChange(entries[0].newBounds);
                }
            });
        });

        if (activate) {
            observer.observe(root);
        }

        return observer;
    }
}
