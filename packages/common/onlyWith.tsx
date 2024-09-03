import React from 'react';
import { useSelector } from 'react-redux';
import { AuthenticationStatus, Right, Role } from './redux/reducers/auth';
import { ReduxState } from './redux/reducers';

enum FeatureLevel {
  production = 'production',
  staging = 'staging',
  development = 'development',
}

interface Props {
  right?: Right;
  status?: AuthenticationStatus;
  featureLevel?: FeatureLevel;
  role?: Role;
  children?: JSX.Element | JSX.Element[];
  isApplicableFeatureLevel?: (level: FeatureLevel) => boolean;
}

const OnlyWith: React.FC<Props> = ({
  status,
  right,
  featureLevel,
  role,
  children,
  isApplicableFeatureLevel,
}) => {
  const auth = useSelector((state: ReduxState) => state.auth);
  if (auth.hasStatusAndRight(status, right)) {
    if (!featureLevel || isApplicableFeatureLevel(featureLevel)) {
      if (role) {
        if (auth.hasRole(role)) {
          return children;
        }
      } else {
        return children;
      }
    }
  }
  return null;
};
export default OnlyWith;
