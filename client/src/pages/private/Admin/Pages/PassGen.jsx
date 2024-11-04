import { useState, useEffect } from 'react';
import { toast , Toaster} from 'sonner';
import { Copy, Eye, EyeOff, RefreshCw, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generatePassword, calculatePasswordStrength } from '@/lib/utils';


const PassGen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
    excludeSimilar: false,
  });

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setPasswordHistory((prev) => [newPassword, ...prev].slice(0, 10));
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Password copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  const handleExport = () => {
    const blob = new Blob([passwordHistory.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Password history exported');
  };

  useEffect(() => {
    if (autoGenerate) {
      handleGeneratePassword();
    }
  }, [options, autoGenerate]);

  const passwordStrength = calculatePasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-700'];

  return (
    <Card className="w-full h-screen max-w-7xl mx-auto">
            <Toaster position="bottom-right"  />

      <CardHeader>
        <CardTitle className="text-6xl">Password Generator</CardTitle>
        <CardDescription>Generate secure passwords with custom options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              readOnly
              className="font-mono text-lg"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyToClipboard}
              aria-label="Copy password"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleGeneratePassword}
              aria-label="Generate new password"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Progress
            value={(passwordStrength / 5) * 100}
            className={strengthColors[passwordStrength - 1]}
          />
          <p className="text-sm text-muted-foreground">
            Strength: {strengthLabels[passwordStrength - 1]}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Password Length: {options.length}</Label>
            <Slider
              value={[options.length]}
              onValueChange={([value]) =>
                setOptions((prev) => ({ ...prev, length: value }))
              }
              min={8}
              max={128}
              step={1}
              className="w-[60%]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="uppercase"
                checked={options.uppercase}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, uppercase: checked }))
                }
              />
              <Label htmlFor="uppercase">Uppercase Letters</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="lowercase"
                checked={options.lowercase}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, lowercase: checked }))
                }
              />
              <Label htmlFor="lowercase">Lowercase Letters</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="numbers"
                checked={options.numbers}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, numbers: checked }))
                }
              />
              <Label htmlFor="numbers">Numbers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="special"
                checked={options.special}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, special: checked }))
                }
              />
              <Label htmlFor="special">Special Characters</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="excludeSimilar"
                checked={options.excludeSimilar}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, excludeSimilar: checked }))
                }
              />
              <Label htmlFor="excludeSimilar">Exclude Similar Characters</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="autoGenerate"
                checked={autoGenerate}
                onCheckedChange={setAutoGenerate}
              />
              <Label htmlFor="autoGenerate">Auto-Generate</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Password History</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Export History
            </Button>
          </div>
          <ScrollArea className="h-32 rounded-md border">
            <div className="p-4 space-y-2">
              {passwordHistory.map((hist, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted"
                >
                  <code className="font-mono">{hist}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(hist);
                      toast.success('Password copied to clipboard');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default PassGen;