import { useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/wedding/Section";

const MAX_FILES = 1000;
const MAX_SIZE = 50 * 1024 * 1024;
const CONCURRENCY = 4;

export function GuestPhotosButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploader, setUploader] = useState("");
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(0);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState<number | null>(null);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    let files = Array.from(list).filter((f) => f.size <= MAX_SIZE);
    const skipped = list.length - files.length;
    if (files.length > MAX_FILES) {
      toast.info(`한 번에 ${MAX_FILES}장까지 올릴 수 있어 앞의 ${MAX_FILES}장만 올릴게요.`);
      files = files.slice(0, MAX_FILES);
    }
    if (skipped > 0) toast.info(`50MB가 넘는 파일 ${skipped}개는 제외했어요.`);

    const who =
      (uploader.trim() || "guest").replace(/[^\p{L}\p{N}_-]/gu, "").slice(0, 20) || "guest";
    setBusy(true);
    setFinished(null);
    setTotal(files.length);
    setDone(0);
    let failed = 0;
    let cursor = 0;

    async function worker() {
      while (cursor < files.length) {
        const file = files[cursor++];
        if (!file) break;
        const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${encodeURIComponent(who).replace(/%/g, "")}.${ext}`;
        const { error } = await supabase.storage
          .from("guest-photos")
          .upload(path, file, file.type ? { contentType: file.type } : {});
        if (error) failed += 1;
        setDone((d) => d + 1);
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    if (failed) toast.error(`${failed}장은 올리지 못했어요. 다시 시도해 주세요.`);
    setFinished(files.length - failed);
    toast.success(`${files.length - failed}개의 사진·영상이 전달되었어요`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mx-auto flex -rotate-2 items-center gap-2 rounded-full border-2 border-dashed border-primary-foreground/30 bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_6px_0_var(--envelope-shade)] transition-transform hover:rotate-0"
        >
          <ImageUp className="size-4" /> 사진·영상 보내기
        </button>
      </DialogTrigger>
      <DialogContent className="dotted-bg max-w-[400px] rounded-3xl border-border">
        <DialogHeader>
          <DialogTitle className="serif-title text-center text-base">사진·영상 보내기</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-center">
          <p className="text-xs leading-relaxed text-muted-foreground">
            예식 당일 담아주신 사진과 영상을 보내주세요.
            <br />한 번에 최대 1,000장까지 올리실 수 있어요.
          </p>
          <Input
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
            placeholder="보내는 분 이름 (선택)"
            maxLength={20}
            disabled={busy}
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={(e) => void handleFiles(e.target.files)}
          />
          <Button className="w-full rounded-full" disabled={busy} onClick={() => inputRef.current?.click()}>
            <ImageUp className="size-4" />
            {busy ? `올리는 중 ${done} / ${total}` : "사진·영상 선택해서 올리기"}
          </Button>
          {busy && (
            <div className="space-y-1">
              <Progress value={total ? (done / total) * 100 : 0} />
              <p className="text-[0.7rem] text-muted-foreground tabular-nums">{Math.round(total ? (done / total) * 100 : 0)}%</p>
            </div>
          )}
          {!busy && finished !== null && (
            <p className="rounded-xl bg-primary/15 p-3 text-xs"> 업로드 완료! {finished}개가 신랑·신부에게 전달되었어요.</p>
          )}
          <p className="text-[0.7rem] text-muted-foreground">
            올리는 동안 창을 닫지 말아주세요. 사진은 신랑 · 신부만 볼 수 있어요.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function GuestPhotosSection() {
  return (
    <Section eyebrow="Guest Snap" title="사진·영상 보내기">
      <p className="mb-5 text-center text-xs leading-relaxed text-muted-foreground">
        오늘 담아주신 장면을 보내주세요.
        <br />
        여러 장을 한 번에 올릴 수 있고, 신랑·신부만 볼 수 있어요.
      </p>
      <GuestPhotosButton />
    </Section>
  );
}
