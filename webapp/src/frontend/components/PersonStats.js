import React           from 'react';
import TranscriptStore from '../stores/TranscriptStore';
import ImageUtils      from '../utils/ImageUtils';
import TopListChart    from './TopListChart';

class PersonStats extends React.Component {
    constructor(props) {
        super(props);

        this.state = { people: [], query: '' };
    }

    componentDidMount() {
        TranscriptStore.addChangeListener(this.handleChange.bind(this));
    }

    componentWillUnmount() {
        TranscriptStore.removeChangeListener(this.handleChange.bind(this));
    }

    handleChange() {
        let people = [];
        let query  = '';

        let result = TranscriptStore.getLastResult();

        if (result) {
            people = result.result.people;
            query = result.query;
        }

        this.setState({
            query: query,
            people: people
        });
    }

    render() {
        let people = this.state.people[this.props.unit] || [];

        if (people.length) {
            let topPerson = people[0];
            let num = this.props.unit === 'pct' ? `${topPerson.pct.toFixed(2)} %` : topPerson.count;
            let unitText = this.props.unit === 'pct' ? 'av sine innlegg' : 'innlegg';

            return (
                <div className="row stats card">
                    <div className="col-md-6 text-center">
                        <img
                            src={ImageUtils.personImageFor(topPerson.meta.external_id)}
                            alt={`Bilde av ${topPerson.key}`}
                            height="200"
                        />

                        <h2 className={`hdo-party-${topPerson.meta.party.toLowerCase()}`}>
                            {topPerson.key} ({topPerson.meta.party})
                        </h2>


                        <div className="lead">
                            <div>
                                har nevnt <strong>{this.state.query}</strong> i
                            </div>

                            <span style={{fontSize: '4rem', padding: '10px'}}>
                                {num}
                            </span>

                            {unitText}
                        </div>

                    </div>

                    <div className="col-md-6">
                        <TopListChart
                            subtitle="Topp 10 personer"
                            unit={this.props.unit}
                            counts={people}
                            sort={true}
                        />
                    </div>
                </div>
            );
        } else {
            return <div />;
        }

    }

}


module.exports = PersonStats;