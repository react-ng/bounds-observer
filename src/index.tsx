import React, {ReactInstance, RefObject} from "react";
import {BoundingClientRectObserver} from "@html-ng/bounding-client-rect-observer";
import PropTypes from "prop-types";
import ReactDOM from 'react-dom';

interface BoundsObserverProps {
    readonly enabled: boolean;

    readonly onBoundsChange: (bounds: DOMRect) => void;

    readonly children: React.ReactElement;
}

export class BoundsObserver extends React.Component<BoundsObserverProps, {}> {
    static propTypes = {
        children: PropTypes.element.isRequired,
    };

    private _childRef = React.createRef<ReactInstance>();

    private _childNode: Element | null = null;

    private _observer: BoundingClientRectObserver | null = null;

    constructor(props: BoundsObserverProps) {
        super(props);
    }

    componentDidMount() {
        const childNode = ReactDOM.findDOMNode(this._childRef.current);

        if (!childNode) {
            throw new Error("Reference should have been set by the time the component is mounted");
        }

        if (!(childNode instanceof Element)) {
            throw new Error("Child's corresponding DOM node should be an Element");
        }

        this._childNode = childNode;

        this._observer = this._observe({
            root: childNode,
            activate: this.props.enabled,
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

        const childNode = this._childNode;

        if (!childNode) {
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
                    root: childNode,
                    // Ensure that the new observer is active, if the previous one was
                    activate: prevProps.enabled,
                });

                this._observer = newObserver;

                return newObserver;
            } else {
                return oldObserver;
            }
        }

        const currentObserver = handleCallbackUpdate();

        if (
            this.props.enabled != prevProps.enabled
        ) {
            if (this.props.enabled) {
                this._activate({observer: currentObserver, root: childNode});
            } else {
                this._deactivate({observer: currentObserver});
            }
        }
    }

    componentWillUnmount() {
        const observer = this._observer;

        if (!observer) {
            throw new Error("Observer should have been installed by the time the component is unmounted");
        }

        this._deactivate({observer});
    }

    render() {
        const child = React.Children.only(this.props.children);

        return React.cloneElement(
            child,
            {
                ref: this._childRef
            },
        );
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
            this._activate({observer, root});
        }

        return observer;
    }

    _activate(args: {
        observer: BoundingClientRectObserver,
        root: Element,
    }) {
        const {observer, root} = args;

        observer.observe(root);

        const initialBounds = root.getBoundingClientRect();

        this.props.onBoundsChange(initialBounds);
    }

    _deactivate(args: {
        observer: BoundingClientRectObserver,
    }) {
        const {observer} = args;

        observer.disconnect();
    }
}
