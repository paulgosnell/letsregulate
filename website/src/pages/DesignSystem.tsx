import { Heart, User, MessageCircle, Gift, Users, GraduationCap, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';
import BreathingAnimation from '../components/BreathingAnimation';
import WaveBackground from '../components/WaveBackground';

export default function DesignSystem() {
  const colors = [
    {
      name: 'Lavender',
      variants: [
        { shade: 'Light', hex: '#E6D5F5', class: 'bg-lavender-light' },
        { shade: 'Default', hex: '#C4A7E7', class: 'bg-lavender' },
        { shade: 'Dark', hex: '#9B7EBD', class: 'bg-lavender-dark' }
      ]
    },
    {
      name: 'Mint',
      variants: [
        { shade: 'Light', hex: '#D5F5E6', class: 'bg-mint-light' },
        { shade: 'Default', hex: '#A8E6CF', class: 'bg-mint' },
        { shade: 'Dark', hex: '#7BC9A6', class: 'bg-mint-dark' }
      ]
    },
    {
      name: 'Peach',
      variants: [
        { shade: 'Light', hex: '#FFE5D9', class: 'bg-peach-light' },
        { shade: 'Default', hex: '#FFB4A2', class: 'bg-peach' },
        { shade: 'Dark', hex: '#FF8B7A', class: 'bg-peach-dark' }
      ]
    },
    {
      name: 'Sky',
      variants: [
        { shade: 'Light', hex: '#D9E8FF', class: 'bg-sky-light' },
        { shade: 'Default', hex: '#A4CAFE', class: 'bg-sky' },
        { shade: 'Dark', hex: '#6FA3E0', class: 'bg-sky-dark' }
      ]
    },
    {
      name: 'Rose',
      variants: [
        { shade: 'Light', hex: '#FFD9E8', class: 'bg-rose-light' },
        { shade: 'Default', hex: '#FFB3D1', class: 'bg-rose' },
        { shade: 'Dark', hex: '#FF8BB8', class: 'bg-rose-dark' }
      ]
    }
  ];

  const icons = [
    { name: 'User', component: User, description: 'Profile, personal' },
    { name: 'MessageCircle', component: MessageCircle, description: 'Feelings, chat' },
    { name: 'Gift', component: Gift, description: 'Tools, resources' },
    { name: 'Heart', component: Heart, description: 'Love, care' },
    { name: 'Users', component: Users, description: 'Parents, family' },
    { name: 'GraduationCap', component: GraduationCap, description: 'Schools, education' },
    { name: 'Sparkles', component: Sparkles, description: 'Success, magic' }
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-lavender border-opacity-20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Logo size="small" />
            <h1 className="text-2xl font-bold text-slate">Design System</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Logo Showcase */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Logo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-slate mb-4">Small</h3>
              <div className="flex justify-center">
                <Logo size="small" />
              </div>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-slate mb-4">Medium</h3>
              <div className="flex justify-center">
                <Logo size="medium" />
              </div>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-slate mb-4">Large</h3>
              <div className="flex justify-center">
                <Logo size="large" />
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Color Palette</h2>
          <div className="space-y-6">
            {colors.map((color) => (
              <div key={color.name} className="card">
                <h3 className="text-xl font-semibold text-slate mb-4">{color.name}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {color.variants.map((variant) => (
                    <div key={variant.shade}>
                      <div className={`${variant.class} h-24 rounded-lg mb-2`} />
                      <p className="text-sm font-medium text-slate">{variant.shade}</p>
                      <p className="text-xs text-slate opacity-60">{variant.hex}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="card">
              <h3 className="text-xl font-semibold text-slate mb-4">Neutral</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="bg-cream h-24 rounded-lg mb-2 border border-slate border-opacity-20" />
                  <p className="text-sm font-medium text-slate">Cream</p>
                  <p className="text-xs text-slate opacity-60">#F5F5F0</p>
                </div>
                <div>
                  <div className="bg-slate h-24 rounded-lg mb-2" />
                  <p className="text-sm font-medium text-slate">Slate</p>
                  <p className="text-xs text-slate opacity-60">#6B7280</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Typography</h2>
          <div className="card space-y-6">
            <div>
              <p className="text-xs text-slate opacity-60 mb-2">Font Family: Nunito, Quicksand</p>
              <h1 className="text-5xl font-bold text-slate">Heading 1</h1>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate">Heading 2</h2>
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-slate">Heading 3</h3>
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-slate">Heading 4</h4>
            </div>
            <div>
              <p className="text-lg text-slate">Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div>
              <p className="text-base text-slate">Body Regular - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div>
              <p className="text-sm text-slate">Body Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div>
              <p className="text-xl font-bold bg-gradient-to-r from-lavender-dark via-sky-dark to-rose-dark bg-clip-text text-transparent">
                Rainbow Gradient Text
              </p>
            </div>
          </div>
        </section>

        {/* Tone of Voice */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Tone of Voice</h2>

          {/* Brand Personality */}
          <div className="card mb-6">
            <h3 className="text-2xl font-semibold text-slate mb-4">Brand Personality</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-lavender-dark mb-3">We Are:</h4>
                <ul className="space-y-2 text-slate">
                  <li className="flex items-start gap-2">
                    <span className="text-mint-dark font-bold">✓</span>
                    <span><strong>Warm & Nurturing</strong> - Like a caring friend who truly understands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-mint-dark font-bold">✓</span>
                    <span><strong>Gentle & Patient</strong> - We meet children where they are</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-mint-dark font-bold">✓</span>
                    <span><strong>Encouraging & Hopeful</strong> - Every feeling is valid, every step forward matters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-mint-dark font-bold">✓</span>
                    <span><strong>Playful & Joyful</strong> - Learning about emotions can be fun!</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-rose-dark mb-3">We Are Not:</h4>
                <ul className="space-y-2 text-slate">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-dark font-bold">✗</span>
                    <span><strong>Clinical or Cold</strong> - We're human, not textbooks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-dark font-bold">✗</span>
                    <span><strong>Dismissive or Minimizing</strong> - All feelings deserve respect</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-dark font-bold">✗</span>
                    <span><strong>Overly Complex</strong> - Simple, clear language always</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-dark font-bold">✗</span>
                    <span><strong>Preachy or Judgmental</strong> - We guide, not lecture</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Writing Principles */}
          <div className="card mb-6">
            <h3 className="text-2xl font-semibold text-slate mb-4">Writing Principles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-lavender-light p-4 rounded-lg">
                <h4 className="font-semibold text-lavender-dark mb-2">Keep It Simple</h4>
                <p className="text-sm text-slate">Use everyday language. If a 7-year-old wouldn't understand it, simplify it.</p>
              </div>
              <div className="bg-sky-light p-4 rounded-lg">
                <h4 className="font-semibold text-sky-dark mb-2">Be Specific</h4>
                <p className="text-sm text-slate">Instead of "feel better", say "feel calmer" or "feel safer". Clarity builds trust.</p>
              </div>
              <div className="bg-peach-light p-4 rounded-lg">
                <h4 className="font-semibold text-peach-dark mb-2">Show, Don't Tell</h4>
                <p className="text-sm text-slate">Use examples and stories. "Like when..." creates connection.</p>
              </div>
              <div className="bg-mint-light p-4 rounded-lg">
                <h4 className="font-semibold text-mint-dark mb-2">Empower, Don't Fix</h4>
                <p className="text-sm text-slate">"You can..." and "You have the tools to..." instead of "You should..."</p>
              </div>
              <div className="bg-rose-light p-4 rounded-lg">
                <h4 className="font-semibold text-rose-dark mb-2">Validate First</h4>
                <p className="text-sm text-slate">Acknowledge feelings before offering solutions. "It's okay to feel..."</p>
              </div>
              <div className="bg-lavender-light p-4 rounded-lg">
                <h4 className="font-semibold text-lavender-dark mb-2">Stay Positive</h4>
                <p className="text-sm text-slate">Focus on what children CAN do, not what they can't.</p>
              </div>
            </div>
          </div>

          {/* Example Phrases */}
          <div className="card mb-6">
            <h3 className="text-2xl font-semibold text-slate mb-4">Example Phrases</h3>
            <div className="space-y-4">
              <div className="bg-mint-light p-4 rounded-lg border-l-4 border-mint-dark">
                <p className="text-slate mb-2"><strong className="text-mint-dark">Opening Lines:</strong></p>
                <ul className="text-sm text-slate space-y-1 ml-4">
                  <li>"Let's explore how you're feeling today..."</li>
                  <li>"Your feelings matter, and we're here to help you understand them"</li>
                  <li>"Every child deserves tools to feel calm and confident"</li>
                </ul>
              </div>
              <div className="bg-sky-light p-4 rounded-lg border-l-4 border-sky-dark">
                <p className="text-slate mb-2"><strong className="text-sky-dark">Encouragement:</strong></p>
                <ul className="text-sm text-slate space-y-1 ml-4">
                  <li>"You're doing great! Every step counts"</li>
                  <li>"It's brave to talk about your feelings"</li>
                  <li>"You've got this. We're here to help"</li>
                </ul>
              </div>
              <div className="bg-peach-light p-4 rounded-lg border-l-4 border-peach-dark">
                <p className="text-slate mb-2"><strong className="text-peach-dark">Call to Action:</strong></p>
                <ul className="text-sm text-slate space-y-1 ml-4">
                  <li>"Try this calming tool and see how you feel"</li>
                  <li>"Let's practice together"</li>
                  <li>"Ready to build your toolkit?"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Media Guidelines */}
          <div className="card">
            <h3 className="text-2xl font-semibold text-slate mb-4">Social Media Guidelines</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lavender-dark mb-2">Post Structure</h4>
                <ul className="text-sm text-slate space-y-2 ml-4">
                  <li><strong>Hook:</strong> Start with a relatable emotion or scenario</li>
                  <li><strong>Value:</strong> Share a tip, insight, or encouragement</li>
                  <li><strong>Action:</strong> Invite engagement or provide next steps</li>
                  <li><strong>Hashtags:</strong> #LetsRegulate #EmotionalWellbeing #ChildrensWellness #ParentingTools #SchoolWellness</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sky-dark mb-2">Example Social Posts</h4>

                {/* Post 1 */}
                <div className="bg-cream p-4 rounded-lg border border-lavender border-opacity-30 mt-2 mb-4">
                  <p className="text-xs font-semibold text-lavender-dark mb-2">POST 1: General Introduction</p>
                  <p className="text-slate text-sm italic mb-3">
                    "When big feelings feel overwhelming, remember: it's okay to pause. 🌈<br /><br />
                    Our calming tools help children recognize their emotions and find their way back to calm.
                    Whether it's deep breathing, gentle movement, or positive affirmations - every child deserves a toolkit for emotional wellbeing.<br /><br />
                    💙 Safe • 💚 Strong • 💛 Seen<br /><br />
                    Ready to help your child feel calm and confident? Let's explore together. ✨"
                  </p>
                  <div className="bg-white p-3 rounded border-l-4 border-sky-dark">
                    <p className="text-xs font-semibold text-sky-dark mb-1">Image Prompt:</p>
                    <p className="text-xs text-slate">
                      "Soft pastel illustration of a young child sitting peacefully on a cloud, surrounded by gentle floating bubbles in lavender, mint, peach, sky blue, and rose colors. The child has a calm, content expression. Dreamy watercolor style, warm lighting, ethereal atmosphere, child-friendly and nurturing aesthetic."
                    </p>
                  </div>
                </div>

                {/* Post 2 */}
                <div className="bg-cream p-4 rounded-lg border border-mint border-opacity-30 mt-2 mb-4">
                  <p className="text-xs font-semibold text-mint-dark mb-2">POST 2: Breathing Exercise</p>
                  <p className="text-slate text-sm italic mb-3">
                    "Did you know? Just 4 deep breaths can help calm a racing heart. 💚<br /><br />
                    Try this with your child: Breathe in for 4, hold for 4, breathe out for 4.
                    It's like giving your body a gentle hug from the inside. Simple, powerful, and always available.<br /><br />
                    What's your favorite calming technique? Share below! 👇"
                  </p>
                  <div className="bg-white p-3 rounded border-l-4 border-mint-dark">
                    <p className="text-xs font-semibold text-mint-dark mb-1">Image Prompt:</p>
                    <p className="text-xs text-slate">
                      "Soft pastel illustration showing gentle ripples or waves in mint green and sky blue, forming a circular breathing pattern. At the center, a peaceful abstract representation of lungs made of soft clouds. Calming gradient background transitioning from lavender to mint. Minimalist, soothing, meditative aesthetic."
                    </p>
                  </div>
                </div>

                {/* Post 3 */}
                <div className="bg-cream p-4 rounded-lg border border-peach border-opacity-30 mt-2 mb-4">
                  <p className="text-xs font-semibold text-peach-dark mb-2">POST 3: Parent Support</p>
                  <p className="text-slate text-sm italic mb-3">
                    "To the parent who whispered 'I don't know if I'm doing this right' - you are. 🧡<br /><br />
                    Teaching emotional regulation isn't about being perfect. It's about showing up, being patient, and learning together.
                    Your child doesn't need you to have all the answers - they need you to be there while they find them.<br /><br />
                    You're doing better than you think. Promise. 💛"
                  </p>
                  <div className="bg-white p-3 rounded border-l-4 border-peach-dark">
                    <p className="text-xs font-semibold text-peach-dark mb-1">Image Prompt:</p>
                    <p className="text-xs text-slate">
                      "Warm pastel illustration of a parent and child silhouette holding hands, standing together looking at a sunrise. Soft peach, rose, and lavender gradient sky. Gentle, hopeful mood. Simple, minimalist style with emphasis on connection and support. Heartwarming and reassuring aesthetic."
                    </p>
                  </div>
                </div>

                {/* Post 4 */}
                <div className="bg-cream p-4 rounded-lg border border-rose border-opacity-30 mt-2 mb-4">
                  <p className="text-xs font-semibold text-rose-dark mb-2">POST 4: Daily Affirmation</p>
                  <p className="text-slate text-sm italic mb-3">
                    "Morning affirmation for little hearts: 💗<br /><br />
                    'I am brave, even when I'm scared.'<br />
                    'My feelings are okay to feel.'<br />
                    'I can ask for help when I need it.'<br />
                    'I am kind to myself and others.'<br /><br />
                    Words have power. These simple phrases can reshape how children see themselves.
                    Try saying one together today! ✨"
                  </p>
                  <div className="bg-white p-3 rounded border-l-4 border-rose-dark">
                    <p className="text-xs font-semibold text-rose-dark mb-1">Image Prompt:</p>
                    <p className="text-xs text-slate">
                      "Soft pastel illustration of a young child looking at their reflection in a mirror, both smiling. Rainbow of gentle pastel colors (lavender, mint, peach, sky, rose) forming a subtle arc or halo around them. Self-love and confidence theme. Whimsical, encouraging, magical realism style."
                    </p>
                  </div>
                </div>

                {/* Post 5 */}
                <div className="bg-cream p-4 rounded-lg border border-sky border-opacity-30 mt-2 mb-4">
                  <p className="text-xs font-semibold text-sky-dark mb-2">POST 5: Movement & Release</p>
                  <p className="text-slate text-sm italic mb-3">
                    "Sometimes feelings get stuck in our bodies. Movement helps let them out! 🌊<br /><br />
                    Quick reset for kids: Star jumps, shoulder rolls, gentle stretches, or even a silly shake!
                    When emotions feel too big, moving our bodies can make them feel just right.<br /><br />
                    How does your child like to move when they're feeling big emotions?"
                  </p>
                  <div className="bg-white p-3 rounded border-l-4 border-sky-dark">
                    <p className="text-xs font-semibold text-sky-dark mb-1">Image Prompt:</p>
                    <p className="text-xs text-slate">
                      "Playful pastel illustration of a child doing a star jump or dancing freely, with motion lines and sparkles in sky blue, lavender, and mint. Abstract flowing shapes representing energy release. Joyful, dynamic, but still gentle aesthetic. Light, airy feeling with soft rainbow accents."
                    </p>
                  </div>
                </div>

                {/* Post 6 */}
                <div className="bg-cream p-4 rounded-lg border border-lavender border-opacity-30 mt-2 mb-4">
                  <p className="text-xs font-semibold text-lavender-dark mb-2">POST 6: Classroom/School Support</p>
                  <p className="text-slate text-sm italic mb-3">
                    "Educators: Imagine a classroom where every child has tools to self-regulate. 💜<br /><br />
                    When students can name their feelings and access calming strategies, learning flows.
                    Fewer disruptions. More focus. Deeper connections. Let's Regulate gives your students that toolkit.<br /><br />
                    Because emotional wellbeing isn't separate from learning - it's the foundation. 📚✨"
                  </p>
                  <div className="bg-white p-3 rounded border-l-4 border-lavender-dark">
                    <p className="text-xs font-semibold text-lavender-dark mb-1">Image Prompt:</p>
                    <p className="text-xs text-slate">
                      "Soft pastel illustration of diverse children sitting in a peaceful circle in a bright classroom, some with eyes closed in calm meditation, others smiling peacefully. Gentle lavender and mint tones. Windows showing soft natural light. Harmonious, inclusive, supportive learning environment aesthetic."
                    </p>
                  </div>
                </div>

                {/* Post 7 */}
                <div className="bg-cream p-4 rounded-lg border border-mint border-opacity-30 mt-2 mb-4">
                  <p className="text-xs font-semibold text-mint-dark mb-2">POST 7: Emotion Validation</p>
                  <p className="text-slate text-sm italic mb-3">
                    "There are no 'bad' feelings. 💚<br /><br />
                    Anger isn't bad. Sadness isn't bad. Fear isn't bad.
                    They're all messengers, telling us something important. When we teach children to welcome all their emotions,
                    we give them permission to be fully human.<br /><br />
                    It's okay to feel. It's okay to be. That's where healing begins. 🌱"
                  </p>
                  <div className="bg-white p-3 rounded border-l-4 border-mint-dark">
                    <p className="text-xs font-semibold text-mint-dark mb-1">Image Prompt:</p>
                    <p className="text-xs text-slate">
                      "Soft pastel illustration of multiple gentle abstract shapes or clouds in different colors (each representing different emotions) - lavender, mint, peach, sky, rose - all coexisting peacefully in a harmonious composition. Nurturing, accepting, inclusive aesthetic. Watercolor texture, dreamy atmosphere."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Buttons</h2>
          <div className="card">
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className="btn-primary" disabled>Disabled</button>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Icons</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {icons.map((icon) => {
              const IconComponent = icon.component;
              return (
                <div key={icon.name} className="card flex items-center gap-4">
                  <div className="w-12 h-12 bg-lavender-light rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-lavender-dark" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate">{icon.name}</p>
                    <p className="text-sm text-slate opacity-60">{icon.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Animations */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Animations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-slate mb-4">Breathing Animation</h3>
              <div className="flex justify-center h-32">
                <BreathingAnimation size={80} color="#C4A7E7" opacity={0.5} />
              </div>
              <p className="text-sm text-slate opacity-60 mt-4">Calm, gentle pulse</p>
            </div>
            <div className="card text-center relative overflow-hidden">
              <h3 className="text-lg font-semibold text-slate mb-4">Wave Background</h3>
              <div className="h-32 relative bg-lavender-light rounded-lg">
                <WaveBackground color="#9B7EBD" className="opacity-40" />
              </div>
              <p className="text-sm text-slate opacity-60 mt-4">Flowing movement</p>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-slate mb-4">Floating Bubbles</h3>
              <div className="flex justify-center gap-4 h-32 items-center">
                <div className="w-12 h-12 bg-rose-dark rounded-full opacity-30 animate-float" />
                <div className="w-8 h-8 bg-sky-dark rounded-full opacity-30 animate-float" style={{ animationDelay: '0.5s' }} />
                <div className="w-10 h-10 bg-mint-dark rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }} />
              </div>
              <p className="text-sm text-slate opacity-60 mt-4">Gentle float effect</p>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Cards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-slate mb-2">Standard Card</h3>
              <p className="text-slate opacity-80">
                Clean white background with rounded corners and subtle shadow. Hover for elevation effect.
              </p>
            </div>
            <div className="card hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-slate mb-2">Interactive Card</h3>
              <p className="text-slate opacity-80">
                Includes hover transform effect for interactive elements.
              </p>
            </div>
          </div>
        </section>

        {/* Business Card Mockup */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Business Card</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Front */}
            <div className="bg-white rounded-xl shadow-2xl p-8 aspect-[1.75/1] flex flex-col justify-between border-2 border-lavender border-opacity-20">
              <Logo size="small" />
              <div className="text-right">
                <p className="text-sm text-slate font-medium">Tools for growing</p>
                <p className="text-sm text-slate font-medium">calm minds and kind hearts</p>
              </div>
            </div>
            {/* Back */}
            <div className="bg-gradient-to-br from-lavender-light via-sky-light to-peach-light rounded-xl shadow-2xl p-8 aspect-[1.75/1] flex flex-col justify-center">
              <div className="space-y-2 text-slate">
                <p className="font-semibold">hello@letsregulate.com</p>
                <p>www.letsregulate.com</p>
                <p>@letsregulate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Mockups */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Social Media</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Instagram Post */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate mb-4">Instagram Post (1080x1080)</h3>
              <div className="aspect-square bg-gradient-to-br from-lavender-light to-peach-light rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <Logo size="large" className="mb-8" />
                  <p className="text-2xl font-bold text-center text-slate">
                    Building emotional wellbeing through play
                  </p>
                </div>
              </div>
            </div>

            {/* Instagram Story */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate mb-4">Instagram Story (1080x1920)</h3>
              <div className="aspect-[9/16] bg-gradient-to-b from-cream to-lavender-light rounded-lg relative overflow-hidden max-w-sm mx-auto">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <Logo size="medium" className="mb-8" />
                  <p className="text-xl font-bold text-slate mb-4">Join the Waitlist</p>
                  <p className="text-slate">Tools for calm, confident kids</p>
                </div>
              </div>
            </div>

            {/* Facebook Cover */}
            <div className="card md:col-span-2">
              <h3 className="text-lg font-semibold text-slate mb-4">Facebook Cover (820x312)</h3>
              <div className="aspect-[820/312] bg-gradient-to-r from-lavender-light via-sky-light to-rose-light rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-between px-12">
                  <Logo size="large" />
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-lavender-dark via-sky-dark to-rose-dark bg-clip-text text-transparent">
                      Let's Regulate
                    </p>
                    <p className="text-lg text-slate mt-2">Tools for emotional wellbeing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Email Signature */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Email Signature</h2>
          <div className="card max-w-2xl">
            <div className="flex items-start gap-6 border-l-4 border-lavender pl-6">
              <div className="flex-shrink-0">
                <Logo size="small" />
              </div>
              <div>
                <p className="font-bold text-slate text-lg">Your Name</p>
                <p className="text-slate">Position Title</p>
                <div className="mt-3 space-y-1 text-sm text-slate opacity-80">
                  <p>hello@letsregulate.com</p>
                  <p>www.letsregulate.com</p>
                </div>
                <p className="mt-3 text-xs text-slate italic">
                  Tools for growing calm minds and kind hearts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient Examples */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">Gradient Patterns</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 rounded-xl bg-gradient-to-r from-lavender-dark via-sky-dark to-rose-dark flex items-center justify-center">
              <p className="text-white font-bold text-xl">Rainbow Gradient</p>
            </div>
            <div className="h-48 rounded-xl bg-gradient-to-br from-lavender-light via-sky-light to-peach-light flex items-center justify-center">
              <p className="text-slate font-bold text-xl">Soft Pastel Gradient</p>
            </div>
            <div className="h-48 rounded-xl bg-gradient-to-b from-cream to-lavender-light flex items-center justify-center">
              <p className="text-slate font-bold text-xl">Cream to Lavender</p>
            </div>
            <div className="h-48 rounded-xl bg-gradient-to-b from-peach-light to-lavender flex items-center justify-center">
              <p className="text-white font-bold text-xl">Peach to Lavender</p>
            </div>
          </div>
        </section>

        {/* AI Prompt Template */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate mb-8">AI Prompt Template</h2>
          <div className="card">
            <p className="text-slate mb-4">
              Copy and paste this brand reference into AI tools (ChatGPT, Claude, Midjourney, etc.) when generating content or images:
            </p>
            <div className="bg-slate text-cream p-6 rounded-lg font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">{`BRAND: Let's Regulate
Emotional wellbeing toolkit for children (ages 5-12)

TAGLINE: "Tools for growing calm minds and kind hearts"
MISSION: Helping children feel safe, strong, and seen

COLORS (Rainbow Pastels):
• Lavender: #C4A7E7 (primary), #E6D5F5 (light), #9B7EBD (dark)
• Mint: #A8E6CF, #D5F5E6 (light), #7BC9A6 (dark)
• Peach: #FFB4A2, #FFE5D9 (light), #FF8B7A (dark)
• Sky: #A4CAFE, #D9E8FF (light), #6FA3E0 (dark)
• Rose: #FFB3D1, #FFD9E8 (light), #FF8BB8 (dark)
• Neutrals: Cream #F5F5F0, Slate #6B7280

VISUAL STYLE:
• Soft, dreamy, watercolor aesthetic
• Gentle floating bubbles and waves
• Child-friendly, nurturing, warm
• Clean, minimalist layouts
• Rainbow gradient accents (lavender→sky→rose)

TONE OF VOICE:
✓ Warm & nurturing (like a caring friend)
✓ Gentle & patient (meet children where they are)
✓ Encouraging & hopeful (every step matters)
✓ Playful & joyful (learning can be fun)
✗ NOT clinical, dismissive, complex, or preachy

WRITING PRINCIPLES:
• Keep it simple (7-year-old level)
• Be specific ("feel calmer" not "feel better")
• Show, don't tell (use examples)
• Empower, don't fix ("You can..." not "You should...")
• Validate first ("It's okay to feel...")
• Stay positive (focus on what children CAN do)

KEY PHRASES:
• "Safe • Strong • Seen"
• "Your feelings matter"
• "Every child deserves tools to feel calm and confident"
• "Let's explore together"
• "It's okay to pause"

HASHTAGS: #LetsRegulate #EmotionalWellbeing #ChildrensWellness #ParentingTools #SchoolWellness`}</pre>
            </div>
            <button
              className="btn-secondary mt-4"
              onClick={() => {
                const text = document.querySelector('pre')?.textContent || '';
                navigator.clipboard.writeText(text);
              }}
            >
              Copy to Clipboard
            </button>
          </div>
        </section>

        {/* Download Resources */}
        <section className="mb-20">
          <div className="card bg-gradient-to-r from-lavender-light to-sky-light">
            <h2 className="text-2xl font-bold text-slate mb-4">Download Resources</h2>
            <p className="text-slate mb-6">
              Access the complete brand style guide, logo files, and design assets.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/BRAND_STYLE_GUIDE.md" className="btn-primary" download>
                Brand Style Guide
              </a>
              <a href="/LOGO_USAGE.md" className="btn-secondary" download>
                Logo Usage Guide
              </a>
              <a href="/AI_BRAND_TEMPLATE.txt" className="btn-secondary" download>
                AI Prompt Template
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
