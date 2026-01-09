import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const products = [
  {
    id: 1,
    title: 'Аккаунт с 25+ Браулерами',
    price: '1 499 ₽',
    oldPrice: '2 499 ₽',
    type: 'Аккаунт',
    trophies: '25 000+',
    image: '🏆',
  },
  {
    id: 2,
    title: 'Буст до 15к трофеев',
    price: '499 ₽',
    oldPrice: '699 ₽',
    type: 'Буст',
    trophies: '15 000',
    image: '⚡',
  },
  {
    id: 3,
    title: 'Премиум аккаунт Легенда',
    price: '3 999 ₽',
    oldPrice: '5 999 ₽',
    type: 'Аккаунт',
    trophies: '50 000+',
    image: '👑',
  },
  {
    id: 4,
    title: 'Буст до 10к трофеев',
    price: '299 ₽',
    oldPrice: '499 ₽',
    type: 'Буст',
    trophies: '10 000',
    image: '🚀',
  },
  {
    id: 5,
    title: 'Стартовый аккаунт',
    price: '499 ₽',
    oldPrice: '799 ₽',
    type: 'Аккаунт',
    trophies: '10 000+',
    image: '🎮',
  },
  {
    id: 6,
    title: 'Буст до 20к трофеев',
    price: '799 ₽',
    oldPrice: '999 ₽',
    type: 'Буст',
    trophies: '20 000',
    image: '💎',
  },
];



export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'support', text: 'Здравствуйте! Чем могу помочь?' },
  ]);
  const [messageInput, setMessageInput] = useState('');

  const categories = ['Все', 'Аккаунты', 'Бусты'];

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => selectedCategory === 'Аккаунты' ? p.type === 'Аккаунт' : p.type === 'Буст');

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    setChatMessages([...chatMessages, { sender: 'user', text: messageInput }]);
    setMessageInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'support', text: 'Спасибо за сообщение! Наш оператор ответит в ближайшее время.' }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl">🎮</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Flomix Shop
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#catalog" className="text-foreground/80 hover:text-primary transition-colors">Каталог</a>
              <a href="#about" className="text-foreground/80 hover:text-primary transition-colors">О нас</a>
              <a href="#guide" className="text-foreground/80 hover:text-primary transition-colors">Как купить</a>
            </nav>
            <Button asChild variant="outline" className="gap-2">
              <a href="https://t.me/Flomix_56" target="_blank" rel="noopener noreferrer">
                <Icon name="Send" size={18} />
                <span className="hidden sm:inline">Связаться в Telegram</span>
                <span className="sm:hidden">Telegram</span>
              </a>
            </Button>
            <Sheet open={chatOpen} onOpenChange={setChatOpen}>
              <SheetTrigger asChild>
                <Button className="gap-2">
                  <Icon name="MessageCircle" size={20} />
                  <span className="hidden sm:inline">Чат</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md animate-slide-in-right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={24} />
                  Поддержка
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full mt-6">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-[80%] ${
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card text-card-foreground'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Введите сообщение..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Flomix Shop
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-foreground/80">
            Продажа аккаунтов и бустов Brawl Stars с приятными ценами
          </p>
          <Button size="lg" className="gap-2 animate-scale-in">
            <Icon name="ShoppingCart" size={20} />
            Перейти к каталогу
          </Button>
        </div>
      </section>

      <section id="catalog" className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold mb-8 text-center">Каталог товаров</h3>
          
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className="transition-all"
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:scale-105 transition-transform duration-300 animate-fade-in">
                <CardHeader>
                  <div className="text-6xl text-center mb-4">{product.image}</div>
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{product.type}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Trophy" size={18} className="text-secondary" />
                    <span className="text-sm text-foreground/70">{product.trophies} трофеев</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">{product.oldPrice}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2">
                    <Icon name="ShoppingBag" size={18} />
                    Купить
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-4xl font-bold mb-6">О нас</h3>
          <p className="text-lg text-foreground/80 mb-4">
            Flomix Shop — надёжный магазин игровых аккаунтов и услуг буста для Brawl Stars. 
            Мы работаем с 2020 года и завоевали доверие тысяч клиентов.
          </p>
          <p className="text-lg text-foreground/80">
            Все аккаунты проверены, бусты выполняются профессиональными игроками. 
            Гарантируем безопасность сделок и приятные цены!
          </p>
        </div>
      </section>



      <section id="guide" className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-4xl font-bold mb-8 text-center">Инструкция по покупке</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">1. Выберите товар</AccordionTrigger>
              <AccordionContent className="text-foreground/80">
                Перейдите в каталог и выберите нужный аккаунт или услугу буста. Все товары имеют подробное описание и цены.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">2. Оформите заказ</AccordionTrigger>
              <AccordionContent className="text-foreground/80">
                Нажмите кнопку "Купить" и заполните форму заказа. Укажите ваши контактные данные и выберите способ оплаты.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">3. Оплатите покупку</AccordionTrigger>
              <AccordionContent className="text-foreground/80">
                После оформления заказа вы получите ссылку на оплату. Мы принимаем оплату через СБП (Систему Быстрых Платежей).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg">4. Получите товар</AccordionTrigger>
              <AccordionContent className="text-foreground/80">
                После подтверждения оплаты вы получите данные аккаунта или мы начнём выполнение буста. Обычно это занимает до 10 минут.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-foreground/60">
          <p className="mb-2">© 2024 Flomix Shop. Все права защищены.</p>
          <p className="text-sm">Продажа аккаунтов и бустов Brawl Stars</p>
        </div>
      </footer>

      <Button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg animate-scale-in"
        size="icon"
      >
        <Icon name="MessageCircle" size={24} />
      </Button>
    </div>
  );
}