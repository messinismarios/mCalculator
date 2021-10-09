import React, {Component} from 'react';

class Screen extends Component {

    render() {

        let {screen,story,classname} = this.props;

        return (
            <div className={classname}>
                <div className="err">ERR</div>
                <div className="story">{story}</div>
                <div className="value">{screen}</div>
            </div>
        );

    }

}

export default Screen;
