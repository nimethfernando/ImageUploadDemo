import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Text>Something went wrong!</Text>;
    }
    return this.props.children;
  }
}

const Root = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

AppRegistry.registerComponent(appName, () => Root);