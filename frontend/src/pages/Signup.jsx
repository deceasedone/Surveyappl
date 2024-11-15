import { useState } from 'react'
import { useSignup } from '@/hooks/useSignup'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from "@/hooks/use-toast"

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('normal')
  const { signup, error, isLoading } = useSignup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!doPasswordMatch()) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered do not match.",
        variant: "destructive",
      })
      return
    }
    try {
      const result = await signup(email, password, role, name, username)
      if (result.success) {
        toast({
          title: "Signup Successful",
          description: "Your account has been created successfully.",
        })
        navigate('/welcome')
      } else {
        toast({
          title: "Signup Failed",
          description: result.error || "An unexpected error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const doPasswordMatch = () => password === confirmPassword

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" onChange={(e) => setName(e.target.value)} value={name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username (optional)</Label>
                <Input id="username" placeholder="johndoe" onChange={(e) => setUsername(e.target.value)} value={username} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} value={email} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  value={confirmPassword}
                  className={confirmPassword && !doPasswordMatch() ? 'border-red-500' : ''}
                  required
                />
                {confirmPassword && !doPasswordMatch() && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>User Role</Label>
                <RadioGroup defaultValue="normal" onValueChange={(value) => setRole(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">Normal User</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin Privileges</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              type="submit" 
              disabled={isLoading || !doPasswordMatch()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
          <p className="text-xs text-center text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}