import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Activity } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/register', { name, email, password });
            if (response.data.token) {
                login(response.data.user, response.data.token);
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] -z-10" />

            <Card className="w-full max-w-md shadow-2xl border-border/80 bg-card/80 backdrop-blur-xl">
                <CardHeader className="text-center pb-4 border-b-0">
                    <div className="mx-auto w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                        <Activity className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
                    <CardDescription className="text-xs">
                        Start analyzing website latency and Lighthouse Core Web Vitals.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-2">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/30 text-rose-400 p-3 rounded-lg text-xs leading-relaxed">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-foreground">Full Name</label>
                            <Input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-foreground">Email address</label>
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-foreground">Password</label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full mt-2 font-medium text-sm"
                        >
                            Sign Up
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-xs text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
