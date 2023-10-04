import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';
import { Skills } from '../../../api/skill/SkillCollection';

class SkillItem extends React.Component {
  render() {
    const { item } = this.props;
    const skillName = Skills.findDoc(item.skillID).name;
    return (
        <ListGroup.Item>
          {skillName}
        </ListGroup.Item>
    );
  }
}

SkillItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default SkillItem;
