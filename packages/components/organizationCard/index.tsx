import React from 'react';
import {
  StyledCardContainer,
  StyledIconContainer,
  StyledIconText,
  StyledInfoContainer,
  StyledName,
  StyledPersonCountContainer,
  StyledPersonCountText,
  StyledSubInfo,
  StyledSubInfoItem,
} from './styles';

interface Props {
    name?: string;
    profile?: string;
    personCount?: string;
    icon?: string;
}

const OrgCardComponent: React.FC<Props> = ({
  name,
  profile,
  personCount,
  icon,
}) => {
  const personAbbr = name?.split(' ')?.map((word) => word.charAt(0).toUpperCase()).join('');
  return (
    <StyledCardContainer>
      <StyledIconContainer>
        {icon
          ? (
            <img
              alt={name}
              src={icon}
            />
          )
          : (
            <StyledIconText>
              {personAbbr || 'PN'}
            </StyledIconText>
          )}
      </StyledIconContainer>
      <StyledInfoContainer>
        <StyledSubInfoItem>
          <StyledName>
            {name || 'Person Name'}
          </StyledName>
        </StyledSubInfoItem>
        <StyledSubInfoItem>
          <StyledSubInfo>
            {profile || 'Job title'}
          </StyledSubInfo>
        </StyledSubInfoItem>
      </StyledInfoContainer>
      {personCount
                && (
                <StyledPersonCountContainer>
                  <StyledPersonCountText>
                    {personCount || 5}
                  </StyledPersonCountText>
                </StyledPersonCountContainer>
                )}
    </StyledCardContainer>
  );
};

export default OrgCardComponent;
