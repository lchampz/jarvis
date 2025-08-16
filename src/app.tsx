import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { RouteRenderer } from './routes/RouteRenderer';
import './index.css';

function App() {
    return (
        <Router>
            <div className="App">
                <RouteRenderer />

                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    duration={4000}
                    expand={true}
                />
            </div>
        </Router>
    );
}

export default App;