"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const initialReviews = [
  {
    id: "r1",
    author: "Jenny Wilson",
    quote:
      "We love Research Lens! Our designers were using it for their projects, so clients already knew what Research Lens was and how to use it.",
    image: "/assets/home/girl.png",
  },
  {
    id: "r2",
    author: "Cody Fisher",
    quote:
      "Fantastic experience. The platform made collaboration smoother and reduced back-and-forth. Highly recommend for fast-moving teams.",
    image: "/assets/home/girl.png",
  },
  {
    id: "r3",
    author: "Robert Fox",
    quote:
      "Setup was quick and the support team is responsive. We shipped our first milestone a week earlier than planned.",
    image: "/assets/home/girl.png",
  },
];

export default function Storereview() {
  const [reviews, setReviews] = useState(initialReviews);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", message: "" });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setReviews((list) => [
      {
        id: `r-${Date.now()}`,
        author: form.name,
        quote: form.message,
        image: "/assets/home/girl.png",
      },
      ...list,
    ]);
    setForm({ name: "", message: "" });
    setOpen(false);
  };

  return (
    <section className="container mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold">Client Reviews</h2>
        <p className="text-sm text-gray-600 mt-1">Check out what our clients say about us</p>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Write a Review</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>Share your experience with us.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Your Name</label>
                <Input name="name" value={form.name} onChange={onChange} placeholder="Jane Doe" required />
              </div>
              <div>
                <label className="text-sm text-gray-700">Your Review</label>
                <Textarea name="message" value={form.message} onChange={onChange} placeholder="Write your review" required />
              </div>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8">
        <Carousel opts={{ loop: true }} className="relative">
          <CarouselContent className="">
            {reviews.map((r) => (
              <CarouselItem key={r.id} className="md:basis-3/4">
                <Card>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-[300px_1fr] gap-6 items-center">
                    <div className="relative w-full h-[220px] sm:h-[260px]">
                      <Image
                        src={r.image}
                        alt={r.author}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="rounded-lg object-cover"
                        priority
                      />
                    </div>
                    <div>
                      <div className="text-2xl text-blue-600 mb-2">“</div>
                      <p className="text-gray-800 leading-7">{r.quote}</p>
                      <div className="mt-4 text-sm text-gray-600">{r.author}</div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-6" />
          <CarouselNext className="-right-6" />
        </Carousel>
      </div>
    </section>
  );
}