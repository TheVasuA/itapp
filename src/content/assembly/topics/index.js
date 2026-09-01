// x86 Assembly topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).
// Examples use Intel syntax (destination first) unless noted.

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Registers
  {
    id: "asm-registers-section",
    title: "Registers",
    level: 1,
    slug: "registers",
    concepts: [],
    children: [
      {
        id: "asm-general-registers",
        title: "General-Purpose Registers",
        level: 2,
        slug: "general-purpose",
        concepts: [
          {
            id: "asm-gpr-intro",
            code: "mov eax, 5      ; load 5 into eax\nadd eax, 3      ; eax = 8\nmov ebx, eax    ; copy eax into ebx",
            note: "The x86 general-purpose registers hold operands for arithmetic and data movement. The 32-bit set is eax, ebx, ecx, edx, esi, edi, esp, and ebp, with 64-bit versions prefixed by r (rax, rbx, ...). Some registers have conventional roles: ecx as a counter, esp as the stack pointer.",
            explanation: {
              heading: 'The general-purpose register file',
              intro: 'General-purpose registers are the small, fast storage slots inside the CPU that hold the values instructions work on. Because they live on the chip rather than in memory, reading and writing them is far quicker than a memory access, so hot code keeps its working values in registers.',
              points: [
                { term: 'Sixteen in 64-bit mode', detail: 'Long mode adds r8 through r15 to the classic eight, giving sixteen integer registers named rax through r15.' },
                { term: 'Conventional roles', detail: 'Many registers have customary uses such as rax for return values, rcx as a loop counter, and rsp as the stack pointer.' },
                { term: 'Operands not memory', detail: 'Instructions like mov and add read and write these registers directly, which is why compilers try to keep frequently used values in them.' },
                { term: 'Same names, wider size', detail: 'The r-prefixed names such as rax are simply the 64-bit view of the older 32-bit registers like eax.' },
              ],
            },
          },
          {
            id: "asm-register-sizes",
            code: "; rax (64) > eax (32) > ax (16) > al (8, low) / ah (8, high)\nmov rax, 0x1122334455667788\nmov eax, 0xDEADBEEF   ; writing eax zeroes the upper 32 bits\nmov al, 0xFF          ; changes only the lowest byte",
            note: "Each register can be accessed at several widths that overlap the same storage. Writing a 32-bit register like eax clears the top half of rax, but writing the 16-bit ax or 8-bit al leaves the higher bits untouched. Knowing this avoids subtle bugs when mixing sizes.",
            explanation: {
              heading: 'Overlapping subregister widths',
              intro: 'A single physical register can be named at 64, 32, 16, and 8 bit widths that all share the same underlying bits. This lets one register serve as a quadword, a doubleword, a word, or a byte depending on which name an instruction uses.',
              points: [
                { term: 'Nested views', detail: 'For rax the layout is rax at 64 bits, eax at 32, ax at 16, and al plus ah at 8, each covering the lower part of the next.' },
                { term: 'The 32-bit zeroing rule', detail: 'Writing a 32-bit register such as eax automatically clears the upper 32 bits of rax, a deliberate design that avoids partial-register stalls.' },
                { term: 'Byte and word writes merge', detail: 'Writing al or ax leaves the higher bits unchanged, so the old contents remain and can surprise you if you assume a full-width value.' },
                { term: 'Legacy high byte', detail: 'The ah, bh, ch, and dh names reach bits 8 through 15 and cannot be combined with the newer r8 through r15 in the same instruction.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "asm-special-registers",
        title: "Special Registers",
        level: 2,
        slug: "special",
        concepts: [
          {
            id: "asm-eip-eflags",
            code: "; EIP/RIP  - instruction pointer (next instruction address)\n; ESP/RSP  - stack pointer (top of stack)\n; EBP/RBP  - base/frame pointer\n; EFLAGS   - status flags (ZF, SF, CF, OF, ...)",
            note: "Beyond the general registers, the instruction pointer holds the address of the next instruction and is changed by jumps and calls rather than by mov. The stack pointer tracks the top of the stack, and the flags register records results of comparisons and arithmetic used by conditional branches.",
            explanation: {
              heading: 'Instruction pointer, stack pointer, and flags',
              intro: 'Special registers steer execution rather than merely holding data. The instruction pointer says what runs next, the stack pointer marks the top of the stack, and the flags register remembers the outcome of the last arithmetic or comparison.',
              points: [
                { term: 'rip is not writable by mov', detail: 'The instruction pointer advances on its own and changes only through jumps, calls, and returns, never through a plain mov.' },
                { term: 'rsp tracks the stack top', detail: 'The stack pointer always points at the most recently pushed item and moves automatically with push, pop, call, and ret.' },
                { term: 'rflags drives branches', detail: 'Bits such as ZF, SF, CF, and OF capture whether a result was zero, negative, or overflowed, and conditional jumps read them.' },
                { term: 'Set implicitly', detail: 'Most arithmetic and compare instructions update the flags as a side effect, so a branch usually follows right after them.' },
              ],
            },
          },
          {
            id: "asm-segment-registers",
            code: "; cs, ds, ss, es, fs, gs - segment selectors\nmov eax, fs:[0x28]   ; read the stack canary via fs on Linux x64",
            note: "Segment registers once selected memory segments but in flat 64-bit mode most are fixed at zero. The fs and gs registers survive as bases for thread-local storage, so operating systems use them to reach per-thread data like the stack canary.",
            explanation: {
              heading: 'Segment registers in flat mode',
              intro: 'Segment registers came from an older memory model that divided address space into segments. In modern flat 64-bit mode most of them act as if their base is zero, but a couple still earn their keep as pointers to per-thread data.',
              points: [
                { term: 'Mostly neutralized', detail: 'The cs, ds, ss, and es registers have an effective base of zero in long mode, so ordinary code ignores them.' },
                { term: 'fs and gs survive', detail: 'These two carry a hidden base address that the operating system programs, making them handy anchors for thread-local storage.' },
                { term: 'Thread-local access', detail: 'Reading fs colon offset 0x28 on Linux fetches the stack canary, a per-thread value used to detect stack smashing.' },
                { term: 'Platform differences', detail: 'Linux tends to use fs for thread data while Windows commonly uses gs, so the same idea maps to different registers.' },
              ],
            },
            example: "; gs:[...] commonly addresses thread-local data on Windows",
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Data Movement
  {
    id: "asm-data-movement",
    title: "Data Movement",
    level: 1,
    slug: "data-movement",
    concepts: [],
    children: [
      {
        id: "asm-mov",
        title: "The mov Instruction",
        level: 2,
        slug: "mov",
        concepts: [
          {
            id: "asm-mov-intro",
            code: "mov eax, 42        ; immediate -> register\nmov ebx, eax       ; register  -> register\nmov [var], eax     ; register  -> memory\nmov ecx, [var]     ; memory    -> register",
            note: "`mov` copies data between registers, memory, and immediate constants without changing any flags. It is the workhorse of assembly. One rule to remember: you cannot mov directly from one memory location to another in a single instruction, so route it through a register.",
            explanation: {
              heading: 'The core data copy',
              intro: 'The mov instruction copies a value from a source operand into a destination operand, leaving the source unchanged. It is by far the most common instruction and forms the plumbing that shuttles values between registers and memory.',
              points: [
                { term: 'Flags untouched', detail: 'Unlike arithmetic, a mov never alters the status flags, so a comparison result stays valid across intervening moves.' },
                { term: 'No memory to memory', detail: 'At most one operand may be a memory reference, so copying between two addresses must pass through a register.' },
                { term: 'Sizes must agree', detail: 'The source and destination widths must match, which is why a size hint like byte or dword is sometimes required.' },
                { term: 'Brackets mean dereference', detail: 'Square brackets around an operand read or write the memory at that address rather than the address value itself.' },
              ],
            },
          },
          {
            id: "asm-lea",
            code: "lea eax, [ebx + ecx*4]   ; eax = ebx + ecx*4 (address, not memory)\nlea esi, [array + 8]     ; compute an address",
            note: "`lea` (load effective address) computes an address expression and stores the result, without touching memory. Because it can do a multiply and add in one step, programmers also use it as a fast arithmetic instruction. Unlike mov with brackets, lea returns the address itself rather than the value there.",
            explanation: {
              heading: 'Load effective address',
              intro: 'The lea instruction evaluates a memory address expression and places the computed address into a register instead of reading the memory at that address. It borrows the addressing hardware to do arithmetic without any actual memory access.',
              points: [
                { term: 'Address, not contents', detail: 'Where mov with brackets loads the value stored at an address, lea returns the address value itself.' },
                { term: 'Free arithmetic', detail: 'Because the addressing form supports base plus scaled index plus displacement, lea can compute expressions like base plus index times four in one instruction.' },
                { term: 'No flags changed', detail: 'lea leaves the flags alone, making it a quiet way to combine a multiply and add without disturbing a pending comparison.' },
                { term: 'Common for pointers', detail: 'It is the natural way to compute the address of an array element or a struct field before using it.' },
              ],
            },
          },
          {
            id: "asm-movzx-movsx",
            code: "mov al, 0xFF\nmovzx ebx, al    ; ebx = 0x000000FF (zero-extended)\nmovsx ecx, al    ; ecx = 0xFFFFFFFF (sign-extended, -1)",
            note: "When moving a smaller value into a larger register you must decide how to fill the extra bits. `movzx` zero-extends, treating the source as unsigned, while `movsx` sign-extends, replicating the top bit to preserve a signed value.",
            explanation: {
              heading: 'Zero versus sign extension',
              intro: 'When a narrow value moves into a wider register the extra high bits must be filled somehow. movzx fills them with zeros for unsigned values, while movsx copies the sign bit so the number keeps its signed meaning.',
              points: [
                { term: 'movzx for unsigned', detail: 'Zero-extension pads the top bits with zero, correct when the source represents an unsigned quantity like a byte count.' },
                { term: 'movsx for signed', detail: 'Sign-extension replicates the most significant bit, so a negative byte such as 0xFF becomes negative one in the wider register.' },
                { term: 'Matches C casts', detail: 'These instructions are exactly what widening integer casts compile to, preserving value rather than raw bits.' },
                { term: 'Avoids stale high bits', detail: 'Using them prevents leftover garbage in the upper part of a register from corrupting later use of the value.' },
              ],
            },
            example: "; movsx is what a (long)someChar cast compiles to",
          },
        ],
        children: [],
      },
      {
        id: "asm-data-definitions",
        title: "Data Definitions",
        level: 2,
        slug: "data-definitions",
        concepts: [
          {
            id: "asm-define-data",
            code: "section .data\n  count   db 5           ; byte (8 bits)\n  total   dw 1000        ; word (16 bits)\n  big     dd 100000      ; doubleword (32 bits)\n  msg     db \"Hello\", 0  ; string with null terminator\n\nsection .bss\n  buffer  resb 64        ; reserve 64 uninitialized bytes",
            note: "Initialized data lives in the `.data` section using directives like db, dw, dd, and dq for byte, word, doubleword, and quadword. Strings are just sequences of bytes. The `.bss` section reserves uninitialized space with resb/resw/resd, which keeps the executable small.",
            explanation: {
              heading: 'Declaring data and reserving space',
              intro: 'Data definition directives tell the assembler to lay out constants of a chosen size in the output, while reservation directives set aside space that starts out zeroed. Choosing the right section keeps the program organized and the file compact.',
              points: [
                { term: 'Size directives', detail: 'db, dw, dd, and dq emit a byte, word, doubleword, and quadword respectively, each initialized to the value you give.' },
                { term: 'The .data section', detail: 'Initialized values that must exist at load time live here and take up real space in the executable file.' },
                { term: 'The .bss section', detail: 'resb, resw, and resd reserve uninitialized storage that the loader zero-fills, so it costs no file space.' },
                { term: 'Strings are bytes', detail: 'A quoted string is just a run of byte values, and a trailing zero marks the end for C-style routines.' },
              ],
            },
          },
          {
            id: "asm-data-arrays",
            code: "section .data\n  nums   dd 10, 20, 30, 40   ; array of four doublewords\n  zeros  times 8 db 0        ; eight zero bytes\n  len    equ ($ - nums) / 4  ; element count via $",
            note: "Listing several values after a directive lays out an array in memory. The `times` prefix repeats a definition, and the `$` symbol means the current address, so subtracting a label from `$` measures a block's size at assembly time.",
            explanation: {
              heading: 'Arrays, repetition, and the current address',
              intro: 'Arrays in assembly are simply consecutive values placed by one directive, and NASM offers helpers to repeat entries and to measure sizes. These features let you build tables and compute lengths without hardcoding numbers.',
              points: [
                { term: 'Comma lists', detail: 'Writing several values after a size directive stores them back to back, forming a contiguous array in memory.' },
                { term: 'The times prefix', detail: 'A times count before a definition repeats it that many times, ideal for zero-filled buffers or padding.' },
                { term: 'The dollar symbol', detail: 'The dollar sign evaluates to the address of the current position, so a label subtracted from it yields a block size.' },
                { term: 'Assembly-time constants', detail: 'Using equ with a dollar expression computes counts like element totals while assembling rather than at runtime.' },
              ],
            },
            example: "; mov eax, [nums + 2*4] loads the third element (30)",
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Arithmetic
  {
    id: "asm-arithmetic",
    title: "Arithmetic",
    level: 1,
    slug: "arithmetic",
    concepts: [],
    children: [
      {
        id: "asm-add-sub",
        title: "Addition & Subtraction",
        level: 2,
        slug: "add-sub",
        concepts: [
          {
            id: "asm-add-sub-intro",
            code: "mov eax, 10\nadd eax, 5     ; eax = 15\nsub eax, 3     ; eax = 12\ninc eax        ; eax = 13\ndec eax        ; eax = 12\nneg eax        ; eax = -12",
            note: "`add` and `sub` perform integer addition and subtraction, storing the result in the destination operand and updating the flags. `inc` and `dec` add or subtract one, and `neg` negates a value. These flag updates are what later conditional jumps test.",
            explanation: {
              heading: 'Basic integer arithmetic',
              intro: 'The add and sub instructions combine two operands and write the result back into the destination, updating the status flags as they go. Lightweight variants handle the common cases of adding one, subtracting one, or negating a value.',
              points: [
                { term: 'Destination gets result', detail: 'add rax, rcx computes rax plus rcx and stores the sum in rax, overwriting the first operand.' },
                { term: 'Flags feed branches', detail: 'These instructions set the zero, sign, carry, and overflow flags, which a following conditional jump reads to decide direction.' },
                { term: 'inc and dec', detail: 'These add or subtract one efficiently but notably leave the carry flag alone, which matters inside carry-based loops.' },
                { term: 'neg for two-complement', detail: 'neg replaces a value with its arithmetic negation, equivalent to subtracting it from zero.' },
              ],
            },
          },
          {
            id: "asm-adc-sbb",
            code: "; add two 64-bit numbers in 32-bit registers\nadd eax, ecx    ; low halves, sets carry\nadc edx, ebx    ; high halves plus the carry",
            note: "`adc` (add with carry) and `sbb` (subtract with borrow) fold the carry flag into the operation, letting you chain arithmetic across multiple registers. This is how you add or subtract numbers wider than a single register.",
            explanation: {
              heading: 'Extended-precision arithmetic',
              intro: 'When a number is wider than one register you process it in pieces, and the carry produced by the low piece must flow into the high piece. adc and sbb read the carry flag to carry or borrow across those pieces.',
              points: [
                { term: 'adc adds the carry', detail: 'Add with carry sums two operands plus the current carry flag, continuing an addition that overflowed the previous register.' },
                { term: 'sbb subtracts the borrow', detail: 'Subtract with borrow removes both the operand and the borrow left by the lower half of a subtraction.' },
                { term: 'Chaining pieces', detail: 'A plain add on the low words sets the carry, then adc on the high words folds it in to complete a wide sum.' },
                { term: 'Order matters', detail: 'You must process the least significant part first so the carry is available when the next part runs.' },
              ],
            },
            example: "; edx:eax now holds the full 64-bit sum",
          },
        ],
        children: [],
      },
      {
        id: "asm-mul-div",
        title: "Multiplication & Division",
        level: 2,
        slug: "mul-div",
        concepts: [
          {
            id: "asm-mul-div-intro",
            code: "mov eax, 6\nmov ebx, 7\nimul ebx        ; edx:eax = eax * ebx (signed)\n\nmov eax, 20\nmov edx, 0      ; clear high dividend\nmov ecx, 3\ndiv ecx         ; eax = quotient (6), edx = remainder (2)",
            note: "`imul` and `mul` do signed and unsigned multiplication, producing a double-width result across edx:eax. `div` and `idiv` divide the edx:eax pair by the operand, leaving the quotient in eax and remainder in edx. Always zero or sign-extend edx before dividing, or you will get wrong results or a fault.",
            explanation: {
              heading: 'Multiply and divide with the edx:eax pair',
              intro: 'Multiplication can produce a result twice as wide as its inputs, and division needs a wide dividend, so these operations use a register pair. The high half lives in edx and the low half in eax, together forming a double-width value.',
              points: [
                { term: 'Double-width product', detail: 'The one-operand mul and imul multiply eax by the operand and place the full result across edx and eax.' },
                { term: 'Dividend is edx:eax', detail: 'div and idiv treat the edx and eax pair as a single wide dividend, dividing it by the given operand.' },
                { term: 'Quotient and remainder', detail: 'After division the quotient sits in eax and the remainder in edx, both available at once.' },
                { term: 'Prepare edx first', detail: 'You must clear or sign-extend edx before dividing, otherwise the wide dividend is wrong or a divide fault occurs.' },
              ],
            },
          },
          {
            id: "asm-cdq-sign-extend",
            code: "mov eax, -20\ncdq             ; sign-extend eax into edx (edx = 0xFFFFFFFF)\nmov ecx, 3\nidiv ecx        ; correct signed division",
            note: "Before a signed `idiv` you must sign-extend the dividend into edx, which `cdq` does by copying eax's top bit across all of edx. For unsigned `div` you instead clear edx with `xor edx, edx`. Skipping this step is a classic source of division faults.",
            explanation: {
              heading: 'Preparing the dividend for division',
              intro: 'Division reads a wide dividend from a register pair, so the high half must be set up to match the sign or unsignedness of the value in eax. cdq and its relatives fill that high half correctly before an idiv runs.',
              points: [
                { term: 'cdq for signed', detail: 'Convert doubleword to quadword copies the top bit of eax across all of edx, extending a signed value into the pair.' },
                { term: 'Clear edx for unsigned', detail: 'Before an unsigned div you zero edx, commonly with xor edx, edx, so no stray high bits pollute the dividend.' },
                { term: 'Size-specific forms', detail: 'cbw, cwd, cdq, and cqo handle 8, 16, 32, and 64 bit sign extension for the matching division width.' },
                { term: 'Faults from skipping', detail: 'Forgetting this step often yields a wrong quotient or triggers a divide error exception when the value overflows.' },
              ],
            },
            example: "; cqo is the 64-bit form, extending rax into rdx",
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Logical & Bitwise
  {
    id: "asm-logical",
    title: "Logical & Bitwise Operations",
    level: 1,
    slug: "logical",
    concepts: [],
    children: [
      {
        id: "asm-bitwise",
        title: "Bitwise Operators",
        level: 2,
        slug: "bitwise",
        concepts: [
          {
            id: "asm-bitwise-intro",
            code: "mov eax, 0b1100\nand eax, 0b1010    ; eax = 0b1000\nor  eax, 0b0001    ; eax = 0b1001\nxor eax, 0b1111    ; eax = 0b0110\nnot eax            ; flip all bits\nxor ebx, ebx       ; idiom: set ebx to 0",
            note: "`and`, `or`, `xor`, and `not` perform bit-level logic, useful for masking and setting flags. A very common idiom is `xor reg, reg`, which zeroes a register faster and in fewer bytes than `mov reg, 0`. `and` with a mask isolates specific bits.",
            explanation: {
              heading: 'Bitwise logic operators',
              intro: 'Bitwise instructions apply a logical operation to each pair of bits independently, giving fine control over individual bits. They are the tools for masking, setting, clearing, and toggling flags packed into an integer.',
              points: [
                { term: 'and to mask', detail: 'Combining a value with a mask using and keeps only the bits where the mask is one and clears the rest.' },
                { term: 'or to set', detail: 'Using or with a mask forces the selected bits to one while leaving the others as they were.' },
                { term: 'xor to toggle', detail: 'Exclusive or flips the bits selected by a mask, and xor of a register with itself is the standard way to zero it.' },
                { term: 'not to invert', detail: 'The not instruction flips every bit, producing the ones complement of the value.' },
              ],
            },
          },
          {
            id: "asm-shifts",
            code: "mov eax, 4\nshl eax, 2     ; logical left shift: eax = 16 (multiply by 4)\nshr eax, 1     ; logical right shift: eax = 8\nsar eax, 1     ; arithmetic right shift preserves sign\nrol eax, 1     ; rotate left",
            note: "Shift instructions move bits left or right by a count. `shl` and `shr` are logical shifts that bring in zeros, effectively multiplying or dividing by powers of two, while `sar` preserves the sign bit for signed division. `rol` and `ror` rotate bits around the end.",
            explanation: {
              heading: 'Shifts and rotates',
              intro: 'Shift instructions slide the bits of a value left or right by a given count, and rotates wrap the bits around instead of discarding them. Shifting is a fast way to multiply or divide by powers of two.',
              points: [
                { term: 'Logical shifts', detail: 'shl and shr move bits and feed in zeros, so a left shift multiplies and a right shift divides an unsigned value by a power of two.' },
                { term: 'Arithmetic right shift', detail: 'sar fills the vacated top bits with copies of the sign bit, giving a correct signed division by a power of two.' },
                { term: 'Rotates preserve bits', detail: 'rol and ror move bits off one end and back in the other, keeping every bit rather than dropping any.' },
                { term: 'Carry catches the last bit', detail: 'The final bit shifted out lands in the carry flag, which can then be tested or chained.' },
              ],
            },
          },
          {
            id: "asm-bit-test",
            code: "bt  eax, 3     ; copy bit 3 of eax into CF\njc  is_set     ; branch if that bit was 1\nbts eax, 5     ; test bit 5 and set it to 1\nbtr eax, 5     ; test bit 5 and reset it to 0",
            note: "The bit-test family inspects a single numbered bit and copies it into the carry flag. `bt` only reads, while `bts`, `btr`, and `btc` additionally set, reset, or complement that bit, making them convenient for bit-array flags.",
            explanation: {
              heading: 'Testing and toggling single bits',
              intro: 'The bit-test instructions target one bit chosen by number and copy its current value into the carry flag. Some variants also modify that bit in the same step, which makes them tidy for managing bit-array flags.',
              points: [
                { term: 'bt reads only', detail: 'Bit test copies the selected bit into the carry flag without changing the source, ready for a carry-based jump.' },
                { term: 'bts sets', detail: 'Bit test and set records the old bit in carry and then forces the bit to one.' },
                { term: 'btr and btc', detail: 'Bit test and reset clears the bit while bit test and complement flips it, each after saving the old value in carry.' },
                { term: 'Branch on carry', detail: 'A jc or jnc right after a bit test reacts to whether the tested bit was one or zero.' },
              ],
            },
            example: "; jc/jnc after bt reacts to the tested bit",
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Addressing Modes
  {
    id: "asm-addressing-section",
    title: "Addressing Modes",
    level: 1,
    slug: "addressing",
    concepts: [],
    children: [
      {
        id: "asm-memory-operands",
        title: "Memory Operands",
        level: 2,
        slug: "memory-operands",
        concepts: [
          {
            id: "asm-addressing-intro",
            code: "mov eax, 5           ; immediate\nmov eax, ebx         ; register\nmov eax, [var]       ; direct memory\nmov eax, [ebx]       ; register indirect (value at address in ebx)\nmov eax, [ebx + 4]   ; base + displacement",
            note: "An operand can be an immediate constant, a register, or a memory reference in square brackets. Register indirect `[ebx]` reads the memory the register points to, and adding a displacement like `[ebx + 4]` reaches a fixed offset from it. These modes let a single instruction touch memory flexibly.",
            explanation: {
              heading: 'Kinds of operand',
              intro: 'Every instruction operand is one of a few kinds, and knowing them clarifies what an instruction actually touches. Values can be baked into the instruction, held in a register, or fetched from memory named by an address expression.',
              points: [
                { term: 'Immediate', detail: 'A constant encoded directly in the instruction, such as the five in mov eax, 5.' },
                { term: 'Register', detail: 'A named register like ebx supplies or receives the value with no memory access at all.' },
                { term: 'Register indirect', detail: 'Brackets around a register, as in bracket ebx, use its contents as an address and read the memory there.' },
                { term: 'Base plus displacement', detail: 'Adding a constant offset inside the brackets reaches a fixed distance from the pointer, ideal for struct fields.' },
              ],
            },
          },
          {
            id: "asm-scaled-index",
            code: "; general form: [base + index*scale + displacement]\nmov eax, [arr + esi*4]      ; element esi of a 4-byte array\nmov edx, [ebp + esi*8 + 16] ; base + scaled index + offset",
            note: "The full scaled-index addressing mode is `[base + index*scale + disp]`, where scale is 1, 2, 4, or 8. It maps directly onto array indexing: the scale is the element size and the index register is the subscript. This one form covers most array and struct access patterns.",
            explanation: {
              heading: 'Scaled-index addressing',
              intro: 'The richest x86 addressing form adds a base register, an index register multiplied by a scale, and a constant displacement. It exists precisely to make array and structure access a single instruction.',
              points: [
                { term: 'Four parts', detail: 'The general form is base plus index times scale plus displacement, and any part may be omitted.' },
                { term: 'Scale is element size', detail: 'The scale factor of one, two, four, or eight matches common element sizes so the index counts elements, not bytes.' },
                { term: 'Index is the subscript', detail: 'Placing the loop counter in the index register makes the hardware compute the element address for you.' },
                { term: 'Computed by hardware', detail: 'The address arithmetic happens in the addressing unit at no extra instruction cost.' },
              ],
            },
          },
          {
            id: "asm-addressing-struct",
            code: "; struct Point { int x; int y; } in ebx\nmov eax, [ebx]        ; x at offset 0\nmov edx, [ebx + 4]    ; y at offset 4\n; array of Point, index in esi:\nmov eax, [ebx + esi*8]      ; .x of element esi\nmov edx, [ebx + esi*8 + 4]  ; .y of element esi",
            note: "Struct fields are just fixed byte offsets from the base pointer, so a displacement selects a field. Combine a scaled index for the struct size with a displacement for the field to walk an array of structs in one instruction.",
            explanation: {
              heading: 'Addressing struct fields and arrays of structs',
              intro: 'A structure is a block of bytes where each field sits at a known fixed offset from the start. Addressing modes turn that layout into simple arithmetic: a displacement picks the field and a scaled index picks the element.',
              points: [
                { term: 'Field is a displacement', detail: 'Adding the field offset to the base pointer, such as base plus four, reaches a specific member.' },
                { term: 'Element is a scaled index', detail: 'Multiplying the index by the structure size steps from one record to the next.' },
                { term: 'Combine both', detail: 'Base plus index times size plus field offset reads a chosen field of a chosen element in one instruction.' },
                { term: 'Layout is compile-time', detail: 'Because offsets are constants known at assembly time, the CPU never searches for a field.' },
              ],
            },
            example: "; scale 8 = sizeof(Point), +4 = offset of y",
          },
          {
            id: "asm-rip-relative",
            code: "; 64-bit position-independent addressing\nlea rax, [rel msg]   ; address of msg relative to rip\nmov al, [rel flag]   ; load a global relative to rip",
            note: "In 64-bit code the preferred way to reach globals is rip-relative addressing, where the address is encoded as an offset from the instruction pointer. This keeps code position-independent so it can load at any base address.",
            explanation: {
              heading: 'Instruction-pointer relative addressing',
              intro: 'In 64-bit mode the CPU can address memory as a signed offset from the current instruction pointer rather than an absolute address. This lets the same code run correctly no matter where the loader places it.',
              points: [
                { term: 'Offset from rip', detail: 'The instruction encodes the distance from the next instruction to the target, and the CPU adds rip at run time.' },
                { term: 'Position independence', detail: 'Because only relative distances are stored, the module works at any load address, which shared libraries require.' },
                { term: 'The rel keyword', detail: 'In NASM writing bracket rel label forces the assembler to emit the rip-relative encoding.' },
                { term: 'Preferred for globals', detail: 'Reaching global variables and string constants this way avoids the need for load-time relocation of absolute addresses.' },
              ],
            },
            example: "; the `rel` keyword forces rip-relative form in NASM",
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Comparisons & Flags
  {
    id: "asm-flags",
    title: "Comparisons & Flags",
    level: 1,
    slug: "flags",
    concepts: [],
    children: [
      {
        id: "asm-cmp-test",
        title: "cmp & test",
        level: 2,
        slug: "cmp-test",
        concepts: [
          {
            id: "asm-cmp-intro",
            code: "cmp eax, ebx    ; sets flags like (eax - ebx) but discards result\n; ZF=1 if equal, SF/OF encode signed ordering, CF for unsigned\n\ntest eax, eax   ; sets flags like (eax AND eax)\n; ZF=1 if eax is zero",
            note: "`cmp` subtracts its operands only to set the flags, without storing the difference, and is the usual setup before a conditional jump. `test` performs a bitwise AND for its flags, and `test reg, reg` is the idiomatic way to check whether a register is zero. Neither instruction changes the operands.",
            explanation: {
              heading: 'Comparing without storing',
              intro: 'The cmp and test instructions perform an operation purely to set the flags and then throw the numeric result away. They are the standard preamble that establishes a condition just before a branch decides what to do.',
              points: [
                { term: 'cmp is a subtract', detail: 'It computes the first operand minus the second and updates the flags, but discards the difference itself.' },
                { term: 'test is an and', detail: 'It computes a bitwise and of its operands for the flags, most often used to check specific bits.' },
                { term: 'Zero check idiom', detail: 'test reg with the same reg sets the zero flag exactly when the register is zero, cheaper than cmp reg, 0.' },
                { term: 'Operands preserved', detail: 'Neither instruction writes to a destination, so the compared values remain available afterward.' },
              ],
            },
          },
          {
            id: "asm-flag-meanings",
            code: "; ZF (zero)     - result was zero\n; SF (sign)     - result was negative (top bit set)\n; CF (carry)    - unsigned overflow / borrow\n; OF (overflow) - signed overflow",
            note: "Arithmetic and comparison instructions update status flags that later branches read. The zero flag marks an equal or zero result, the sign flag a negative result, and the carry and overflow flags detect unsigned and signed overflow respectively. Choosing signed versus unsigned jumps depends on which flags they inspect.",
            explanation: {
              heading: 'What the status flags mean',
              intro: 'The flags register holds single-bit indicators that summarize the result of the most recent arithmetic or comparison. Each flag captures a different property, and conditional jumps combine them to test signed or unsigned relationships.',
              points: [
                { term: 'Zero flag', detail: 'ZF is set when the result is zero, which after a cmp means the two operands were equal.' },
                { term: 'Sign flag', detail: 'SF copies the top bit of the result, marking a negative outcome in signed interpretation.' },
                { term: 'Carry flag', detail: 'CF signals an unsigned overflow or borrow and drives the unsigned above and below jumps.' },
                { term: 'Overflow flag', detail: 'OF signals a signed overflow and, with the sign flag, drives the signed greater and less jumps.' },
              ],
            },
          },
          {
            id: "asm-setcc-cmov",
            code: "cmp eax, ebx\nsetg al        ; al = 1 if eax > ebx (signed), else 0\nmovzx eax, al  ; widen the boolean to a full register\n\ncmp ecx, edx\ncmovl eax, esi ; eax = esi only if ecx < edx",
            note: "`setcc` writes a 0 or 1 byte based on the flags, turning a comparison into a boolean without branching. `cmovcc` conditionally moves a value, letting you select between two options branch-free, which avoids costly mispredictions.",
            explanation: {
              heading: 'Branch-free conditionals',
              intro: 'Rather than jumping, some instructions turn the flags directly into data. setcc materializes a boolean and cmovcc selects a value conditionally, both avoiding the branch that a mispredicting processor would penalize.',
              points: [
                { term: 'setcc writes a byte', detail: 'A setcc instruction stores one when its condition holds and zero otherwise into an eight-bit register.' },
                { term: 'Widen the boolean', detail: 'Following setcc with movzx extends the single byte into a full register when a wider result is needed.' },
                { term: 'cmovcc selects a value', detail: 'Conditional move copies the source only when the condition is true, choosing between two values without a jump.' },
                { term: 'Avoids mispredictions', detail: 'Because there is no branch, unpredictable conditions do not stall the pipeline the way a mispredicted jump would.' },
              ],
            },
            example: "; setz/setnz, seta/setb mirror the jump conditions",
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Control Flow
  {
    id: "asm-control-section",
    title: "Control Flow",
    level: 1,
    slug: "control-flow",
    concepts: [],
    children: [
      {
        id: "asm-jumps",
        title: "Jumps & Branches",
        level: 2,
        slug: "jumps",
        concepts: [
          {
            id: "asm-jmp-intro",
            code: "  cmp eax, 10\n  jge done       ; jump if eax >= 10 (signed)\n  add eax, 1\ndone:\n  jmp exit       ; unconditional jump",
            note: "`jmp` transfers control unconditionally to a label. Conditional jumps such as jz/je (equal), jne, jg/jl (signed), and ja/jb (unsigned) branch based on the flags set by a preceding cmp or arithmetic instruction. Labels mark the targets and end with a colon.",
            explanation: {
              heading: 'Jumps and labels',
              intro: 'Jumps change which instruction runs next by setting the instruction pointer to a labeled target. An unconditional jump always goes, while conditional jumps decide based on the flags left by a previous compare.',
              points: [
                { term: 'Labels are targets', detail: 'A name followed by a colon marks a position in the code that a jump can name as its destination.' },
                { term: 'Unconditional jmp', detail: 'The plain jmp always transfers control, useful for skipping over an else block or looping back.' },
                { term: 'Signed versus unsigned', detail: 'jg and jl test signed order while ja and jb test unsigned order, so the correct pair depends on the data.' },
                { term: 'Equality jumps', detail: 'je and jne branch on the zero flag, reacting to whether a preceding cmp found the operands equal.' },
              ],
            },
          },
          {
            id: "asm-loops",
            code: "  mov ecx, 5\nnext:\n  ; ... loop body runs 5 times ...\n  dec ecx\n  jnz next       ; jump while ecx != 0\n\n  ; the loop instruction does dec ecx + jnz in one step:\n  ; loop next",
            note: "A counted loop is built by decrementing a counter and using a conditional jump to repeat until it reaches zero. The dedicated `loop` instruction combines decrementing ecx with the jump, though the explicit dec/jnz form is often preferred for clarity and speed.",
            explanation: {
              heading: 'Building loops',
              intro: 'A loop is just a backward jump guarded by a condition, usually a counter that counts down to zero. You decrement the counter each pass and jump back while it remains nonzero.',
              points: [
                { term: 'Counter in a register', detail: 'A register such as ecx holds the remaining iteration count that the loop body reduces each time.' },
                { term: 'dec then jnz', detail: 'Decrementing the counter and jumping back while the zero flag is clear is the explicit and preferred loop form.' },
                { term: 'The loop instruction', detail: 'The dedicated loop opcode decrements ecx and branches in one step, though it is often slower than the manual form.' },
                { term: 'Body before test', detail: 'Placing the check at the bottom runs the body first, matching a do-while style that avoids an extra jump.' },
              ],
            },
          },
          {
            id: "asm-if-else-pattern",
            code: "  cmp eax, ebx\n  jle else_branch   ; if (eax > ebx)\n  ; ... then block ...\n  jmp endif\nelse_branch:\n  ; ... else block ...\nendif:",
            note: "A high-level if/else compiles to a compare, a conditional jump that skips the then-block when the condition is false, and an unconditional jump past the else. Note the jump condition is the inverse of the source condition being tested.",
            explanation: {
              heading: 'Compiling if and else',
              intro: 'A high-level conditional becomes a compare followed by a jump that skips the then-block when the test fails. An unconditional jump then hops over the else-block so only one branch runs.',
              points: [
                { term: 'Inverted condition', detail: 'The conditional jump uses the opposite of the source test, since it must skip the then-block precisely when the condition is false.' },
                { term: 'Fall through to then', detail: 'When the condition holds, execution falls straight into the then-block without any jump.' },
                { term: 'Jump past the else', detail: 'At the end of the then-block an unconditional jump skips over the else-block to the merge point.' },
                { term: 'Merge label', detail: 'A final label marks where both paths reconverge and normal execution resumes.' },
              ],
            },
            example: "; the taken branch skips over the block that should not run",
          },
        ],
        children: [],
      },
      {
        id: "asm-jump-tables",
        title: "Jump Tables",
        level: 2,
        slug: "jump-tables",
        concepts: [
          {
            id: "asm-jump-table-switch",
            code: "section .data\n  table dd case0, case1, case2   ; array of label addresses\nsection .text\n  cmp eax, 2\n  ja  default\n  jmp [table + eax*4]            ; jump to table[eax]",
            note: "A jump table implements a dense switch statement by storing target addresses in an array and jumping through the entry selected by the index. It runs in constant time regardless of case count, unlike a chain of comparisons. Always range-check the index first.",
            explanation: {
              heading: 'Jump tables for dense switches',
              intro: 'A jump table turns a switch into a single indexed jump by storing the address of each case in an array. The selector indexes that array and the CPU jumps straight to the chosen handler.',
              points: [
                { term: 'Array of addresses', detail: 'Each table entry is the address of a case label, laid out in memory as a list of pointers.' },
                { term: 'Indexed indirect jump', detail: 'Jumping through bracket table plus index times pointer size sends control directly to the selected case.' },
                { term: 'Constant time', detail: 'Unlike a chain of comparisons, dispatch costs the same regardless of how many cases exist.' },
                { term: 'Range-check first', detail: 'An unsigned above comparison against the table size must guard the index so an out-of-range value cannot jump to garbage.' },
              ],
            },
            example: "; ja default guards against out-of-range indices",
          },
        ],
        children: [],
      },
    ],
  },

  // 8. The Stack
  {
    id: "asm-stack",
    title: "The Stack",
    level: 1,
    slug: "stack",
    concepts: [],
    children: [
      {
        id: "asm-push-pop",
        title: "push & pop",
        level: 2,
        slug: "push-pop",
        concepts: [
          {
            id: "asm-push-pop-intro",
            code: "push eax        ; esp -= 4, then store eax at [esp]\npush ebx\npop ecx         ; load [esp] into ecx, then esp += 4\npop edx         ; the stack is last-in, first-out",
            note: "The stack is a region of memory that grows downward toward lower addresses. `push` decrements the stack pointer and writes a value, while `pop` reads the top value and increments the pointer. Because it is last-in first-out, pushes and pops must be balanced.",
            explanation: {
              heading: 'How push and pop use the stack',
              intro: 'The stack is a last-in first-out region of memory that grows toward lower addresses, with the stack pointer marking its top. push and pop are shorthand for adjusting that pointer and moving a value in one instruction.',
              points: [
                { term: 'Grows downward', detail: 'Pushing lowers the stack pointer, so the newest item sits at the smallest address currently in use.' },
                { term: 'push writes then adjusts', detail: 'push subtracts the operand size from rsp and stores the value at the new top of the stack.' },
                { term: 'pop reads then adjusts', detail: 'pop loads the value at the top into a destination and then adds the operand size back to rsp.' },
                { term: 'Keep it balanced', detail: 'Every push needs a matching pop, otherwise the stack pointer drifts and later returns land at the wrong place.' },
              ],
            },
          },
          {
            id: "asm-stack-scratch",
            code: "push eax          ; save a register before clobbering it\nmov eax, [value]\ncall helper\npop eax           ; restore the original eax",
            note: "The stack is the standard place to save registers you must preserve across a call or a computation. Push the value before, then pop it back afterward. This pattern protects a caller's data when a routine needs the same register for its own work.",
            explanation: {
              heading: 'The stack as scratch storage',
              intro: 'Because registers are few, code often needs to borrow one that already holds a live value. The stack provides temporary storage: push the value away, use the register freely, then pop it back to its original state.',
              points: [
                { term: 'Save then restore', detail: 'A push before the risky code and a matching pop after returns the register to its earlier contents.' },
                { term: 'Protects across calls', detail: 'Wrapping a call in push and pop guards a value the callee might clobber.' },
                { term: 'Last in first out', detail: 'When saving several registers, pop them in the reverse order of the pushes so each lands back correctly.' },
                { term: 'Cheap and local', detail: 'Stack accesses near the top are fast and cached, making this a low-cost way to free up a register.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Procedures & Calling Conventions
  {
    id: "asm-procedures",
    title: "Procedures & Calling Conventions",
    level: 1,
    slug: "procedures",
    concepts: [],
    children: [
      {
        id: "asm-call-ret",
        title: "call & ret",
        level: 2,
        slug: "call-ret",
        concepts: [
          {
            id: "asm-call-intro",
            code: "  call square      ; push return address, jump to square\n  ; execution resumes here after ret\n  jmp done\n\nsquare:\n  imul eax, eax\n  ret              ; pop return address, jump back to caller",
            note: "`call` pushes the address of the following instruction onto the stack and jumps to the procedure. `ret` pops that address and returns control to the caller. This pairing is what makes reusable subroutines possible in assembly.",
            explanation: {
              heading: 'Calling and returning',
              intro: 'The call and ret pair implement subroutines by remembering where to come back. call records the return address on the stack before jumping, and ret uses that saved address to resume the caller.',
              points: [
                { term: 'call saves return', detail: 'It pushes the address of the instruction right after the call, then jumps to the target procedure.' },
                { term: 'ret pops and jumps', detail: 'Return pops the top of the stack into the instruction pointer, sending control back to the caller.' },
                { term: 'Stack must be balanced', detail: 'The procedure must leave rsp pointing at the return address, or ret jumps to the wrong place.' },
                { term: 'Enables reuse', detail: 'Because the return address is saved automatically, one procedure can be called from many places.' },
              ],
            },
          },
          {
            id: "asm-stack-frame",
            code: "func:\n  push ebp          ; save caller's frame pointer\n  mov ebp, esp      ; set up new frame\n  sub esp, 16       ; reserve 16 bytes for locals\n  ; ... body: [ebp+8] first arg, [ebp-4] first local ...\n  mov esp, ebp      ; discard locals\n  pop ebp           ; restore caller's frame\n  ret",
            note: "A stack frame gives a procedure a stable base for its arguments and local variables via ebp. The prologue saves the old frame pointer and sets up a new one, and the epilogue reverses it before returning. Arguments sit above ebp and locals below it.",
            explanation: {
              heading: 'The stack frame',
              intro: 'A stack frame is the slice of stack a function uses for its arguments, saved registers, and locals. Anchoring a frame pointer at a fixed spot gives stable offsets to reach each of those even as the stack pointer moves.',
              points: [
                { term: 'Prologue sets up', detail: 'Pushing the old base pointer and copying the stack pointer into it establishes a fixed reference for the frame.' },
                { term: 'Reserve for locals', detail: 'Subtracting from the stack pointer carves out space below the frame pointer for local variables.' },
                { term: 'Offsets locate data', detail: 'Positive offsets from the frame pointer reach incoming arguments while negative offsets reach locals.' },
                { term: 'Epilogue tears down', detail: 'Restoring the stack pointer and popping the old base pointer undoes the frame before ret runs.' },
              ],
            },
          },
          {
            id: "asm-nested-calls",
            code: "outer:\n  push ebp\n  mov ebp, esp\n  push dword [ebp+8]   ; forward our arg\n  call inner           ; nested call; return addr stacked again\n  add esp, 4           ; clean up the pushed arg\n  ; eax now holds inner's result\n  pop ebp\n  ret",
            note: "Because each `call` pushes its own return address, calls nest naturally: the stack tracks the chain of pending returns. A caller preserves its frame around the inner call and cleans up any arguments it pushed once control comes back.",
            explanation: {
              heading: 'Nested calls',
              intro: 'Function calls nest because every call stacks its own return address on top of the previous ones. The stack naturally records the chain of pending returns, so control unwinds correctly as each ret runs.',
              points: [
                { term: 'Each call stacks a return', detail: 'A nested call pushes another return address above the outer one, building a list of where to resume.' },
                { term: 'Frames layer up', detail: 'Each active function has its own frame on the stack, stacked in the order the calls were made.' },
                { term: 'Caller cleans arguments', detail: 'When a convention makes the caller responsible, it adjusts the stack pointer to drop pushed arguments after the call.' },
                { term: 'Backtrace follows the chain', detail: 'A debugger walks the saved frame pointers and return addresses to reconstruct who called whom.' },
              ],
            },
            example: "; the return-address chain is what a debugger's backtrace walks",
          },
          {
            id: "asm-recursion",
            code: "; int fact(int n) in eax\nfact:\n  cmp eax, 1\n  jle .base\n  push eax          ; save n\n  dec eax\n  call fact         ; eax = fact(n-1)\n  pop ecx           ; recover n\n  imul eax, ecx     ; n * fact(n-1)\n  ret\n.base:\n  mov eax, 1\n  ret",
            note: "Recursion works in assembly because every invocation gets its own stack space for saved values and the return address. This factorial saves n on the stack before recursing, then multiplies it back in after the recursive call returns.",
            explanation: {
              heading: 'Recursion on the stack',
              intro: 'Recursion works because each invocation of a function gets a fresh frame with its own copies of saved values and its own return address. The stack keeps these separate so an inner call cannot disturb an outer one.',
              points: [
                { term: 'Per-level storage', detail: 'Every recursive call pushes its own state, so the value of n at one level does not overwrite another.' },
                { term: 'Save before recursing', detail: 'The factorial pushes n onto the stack before the recursive call so it survives the callee.' },
                { term: 'Combine on the way back', detail: 'After the recursive call returns, the saved n is popped and multiplied into the result.' },
                { term: 'Base case stops it', detail: 'A terminating condition returns without recursing, or the stack would grow until it overflows.' },
              ],
            },
            example: "; each recursive level pushes its own n; the base case stops it",
          },
        ],
        children: [],
      },
      {
        id: "asm-calling-conventions",
        title: "Calling Conventions",
        level: 2,
        slug: "calling-conventions",
        concepts: [
          {
            id: "asm-cdecl",
            code: "; cdecl (32-bit): args pushed right-to-left, caller cleans up\n  push dword 3     ; second arg\n  push dword 2     ; first arg\n  call add_two\n  add esp, 8       ; caller removes the two args\n  ; result returned in eax",
            note: "A calling convention is the agreed contract for passing arguments and returning results. In 32-bit cdecl, arguments are pushed right to left and the caller removes them after the call, with the return value in eax. Following the convention lets your code interoperate with C and libraries.",
            explanation: {
              heading: 'The cdecl convention',
              intro: 'A calling convention is the shared agreement between caller and callee about how arguments arrive and results come back. The 32-bit cdecl convention passes arguments on the stack and makes the caller responsible for cleaning them up.',
              points: [
                { term: 'Arguments on the stack', detail: 'Callers push arguments in right-to-left order so the first argument ends up nearest the top.' },
                { term: 'Caller cleans up', detail: 'After the call the caller adds to the stack pointer to remove the arguments it pushed.' },
                { term: 'Return in eax', detail: 'The function leaves its integer result in eax where the caller expects it.' },
                { term: 'Enables interoperation', detail: 'Following the convention lets hand-written assembly call and be called by C code and libraries.' },
              ],
            },
          },
          {
            id: "asm-systemv-amd64",
            code: "; System V AMD64 (Linux 64-bit): first 6 integer args in registers\n; rdi, rsi, rdx, rcx, r8, r9  -> then the stack\n  mov rdi, 2       ; first arg\n  mov rsi, 3       ; second arg\n  call add_two     ; result in rax",
            note: "The 64-bit System V convention used on Linux and macOS passes the first six integer arguments in registers (rdi, rsi, rdx, rcx, r8, r9) for speed, spilling the rest to the stack. The return value comes back in rax. Windows x64 uses a different register set, so conventions are platform-specific.",
            explanation: {
              heading: 'System V AMD64 argument passing',
              intro: 'The System V AMD64 convention used on Linux and macOS speeds up calls by delivering the first several arguments in registers instead of memory. Only the overflow arguments touch the stack, and the result returns in a fixed register.',
              points: [
                { term: 'Six integer registers', detail: 'The first six integer or pointer arguments go in rdi, rsi, rdx, rcx, r8, and r9 in that order.' },
                { term: 'Extra args spill', detail: 'Arguments beyond the sixth are pushed onto the stack, right to left, by the caller.' },
                { term: 'Return in rax', detail: 'A function places its integer or pointer result in rax, with rdx for the high half of a wide return.' },
                { term: 'Platform specific', detail: 'Windows x64 uses a different register set such as rcx and rdx first, so conventions do not carry across operating systems.' },
              ],
            },
          },
          {
            id: "asm-caller-callee-saved",
            code: "; System V AMD64 register duties:\n; caller-saved (scratch): rax, rcx, rdx, rsi, rdi, r8-r11\n; callee-saved (preserved): rbx, rbp, r12-r15\nmy_func:\n  push rbx      ; must preserve rbx\n  ; ... use rbx freely ...\n  pop rbx\n  ret",
            note: "Conventions split registers into caller-saved, which a callee may freely clobber, and callee-saved, which a function must restore before returning. If your routine uses a callee-saved register it must push it in the prologue and pop it in the epilogue.",
            explanation: {
              heading: 'Caller-saved versus callee-saved',
              intro: 'A convention divides registers into two responsibility groups so that callers and callees know which values survive a call. This split lets each side avoid saving registers the other has already agreed to protect.',
              points: [
                { term: 'Caller-saved are scratch', detail: 'Registers like rax, rcx, rdx, rsi, rdi, and r8 through r11 may be freely overwritten by a callee.' },
                { term: 'Callee-saved are preserved', detail: 'Registers like rbx, rbp, and r12 through r15 must hold the same value on return as on entry.' },
                { term: 'Save in the prologue', detail: 'A function that wants a callee-saved register pushes it on entry and pops it before returning.' },
                { term: 'Choose registers wisely', detail: 'Keeping a value alive across a call is cheapest in a callee-saved register, since the callee will protect it.' },
              ],
            },
            example: "; a caller keeps live values in callee-saved regs across a call",
          },
        ],
        children: [],
      },
    ],
  },

  // 10. String Instructions
  {
    id: "asm-strings",
    title: "String Instructions",
    level: 1,
    slug: "string-instructions",
    concepts: [],
    children: [
      {
        id: "asm-string-ops",
        title: "movs, stos & rep",
        level: 2,
        slug: "string-ops",
        concepts: [
          {
            id: "asm-rep-movs",
            code: "  mov esi, source    ; source pointer\n  mov edi, dest      ; destination pointer\n  mov ecx, 100       ; count\n  cld                ; clear direction flag (forward)\n  rep movsb          ; copy ecx bytes from [esi] to [edi]",
            note: "String instructions operate on memory pointed to by esi (source) and edi (destination), advancing them automatically. The `rep` prefix repeats the operation ecx times, so `rep movsb` is a compact memory copy. The direction flag chooses whether the pointers move up or down; `cld` selects forward.",
            explanation: {
              heading: 'Repeated string moves',
              intro: 'String instructions process memory through dedicated pointer registers that advance automatically after each element. Prefixing one with rep repeats it a counted number of times, turning a block copy into a single instruction.',
              points: [
                { term: 'Fixed pointer roles', detail: 'The source pointer is esi and the destination pointer is edi, both stepping forward or backward on their own.' },
                { term: 'rep repeats by count', detail: 'The rep prefix runs the operation ecx times, decrementing ecx until it reaches zero.' },
                { term: 'Direction flag', detail: 'The direction flag decides whether pointers increment or decrement, and cld selects the forward direction.' },
                { term: 'Element size in the suffix', detail: 'The b, w, or d suffix of movs sets whether each step moves a byte, word, or doubleword.' },
              ],
            },
          },
          {
            id: "asm-scas-stos",
            code: "  mov edi, buffer\n  mov ecx, 64\n  mov al, 0\n  rep stosb          ; fill 64 bytes with 0 (like memset)\n\n  mov al, 'x'\n  repne scasb        ; scan for 'x', stop when found",
            note: "`stos` stores the accumulator into memory at edi, making `rep stosb` a fast fill similar to memset. `scas` compares the accumulator against memory, and with `repne` it scans until a match, useful for finding a byte or a string terminator. These primitives map onto common C library routines.",
            explanation: {
              heading: 'Store and scan primitives',
              intro: 'Beyond copying, the string family can fill memory and search it using the accumulator register. Combined with repeat prefixes these become the building blocks behind familiar C library routines.',
              points: [
                { term: 'stos fills', detail: 'Store string writes the value in al, ax, or eax to the destination, so rep stosb behaves like memset.' },
                { term: 'scas searches', detail: 'Scan string compares the accumulator against memory at edi and sets the flags for a match test.' },
                { term: 'repne scans until match', detail: 'The repeat while not equal prefix keeps scanning until scas finds the target byte or the count runs out.' },
                { term: 'Maps to C routines', detail: 'These primitives underlie implementations of memset, strlen, and memchr in many libraries.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Floating Point & SSE
  {
    id: "asm-floating-point",
    title: "Floating Point & SSE",
    level: 1,
    slug: "floating-point",
    concepts: [],
    children: [
      {
        id: "asm-sse-scalar",
        title: "Scalar SSE Math",
        level: 2,
        slug: "sse-scalar",
        concepts: [
          {
            id: "asm-sse-scalar-intro",
            code: "movsd xmm0, [a]     ; load a double into xmm0\naddsd xmm0, [b]     ; xmm0 = a + b\nmulsd xmm0, xmm1    ; xmm0 = xmm0 * xmm1\nmovsd [result], xmm0",
            note: "Modern x86 does floating point in the 128-bit xmm registers using SSE. Scalar instructions ending in `sd` (double) or `ss` (single) operate on just the low element, so movsd/addsd/mulsd behave like ordinary double-precision math.",
            explanation: {
              heading: 'Scalar SSE floating point',
              intro: 'Modern x86 performs floating point in the wide xmm registers rather than the old stack-based unit. Scalar SSE instructions touch only the lowest element of an xmm register, giving straightforward single-value math.',
              points: [
                { term: 'xmm registers', detail: 'Floating-point values live in the 128-bit xmm registers, of which scalar code uses just the low lane.' },
                { term: 'Suffix picks precision', detail: 'An sd suffix means a 64-bit double and an ss suffix means a 32-bit single, as in addsd versus addss.' },
                { term: 'Scalar ignores upper lanes', detail: 'Operations like movsd and mulsd affect only the low element, leaving the rest of the register aside.' },
                { term: 'Full arithmetic set', detail: 'addsd, subsd, mulsd, divsd, and sqrtsd cover the common scalar double-precision operations.' },
              ],
            },
            example: "; divsd, subsd, and sqrtsd round out the scalar set",
          },
          {
            id: "asm-sse-convert-compare",
            code: "cvtsi2sd xmm0, eax   ; int -> double\ncvttsd2si eax, xmm0  ; double -> int (truncating)\n\nucomisd xmm0, xmm1   ; compare doubles, set EFLAGS\nja  greater          ; use unsigned-style jumps after ucomisd",
            note: "The cvt family converts between integers and floats, with the extra t (cvttsd2si) meaning truncate toward zero. Compare floats with `ucomisd`, which sets the same flags as integer cmp, but you branch with the unsigned conditions ja/jb because of how NaN is encoded.",
            explanation: {
              heading: 'Converting and comparing floats',
              intro: 'Moving between integer and floating-point form uses the convert family, and comparing floats uses a special compare that reports its result through the ordinary flags. The details of rounding and of not-a-number values shape how you use them.',
              points: [
                { term: 'cvt converts', detail: 'Instructions like cvtsi2sd turn an integer into a double, while cvtsd2si turns a double back into an integer.' },
                { term: 'Extra t truncates', detail: 'The double t in cvttsd2si means round toward zero rather than following the current rounding mode.' },
                { term: 'ucomisd sets flags', detail: 'The unordered compare writes its result into the same zero, parity, and carry flags that integer cmp uses.' },
                { term: 'Use unsigned jumps', detail: 'Because of how the flags are laid out, branch with ja and jb after a float compare, and jp catches a not-a-number result.' },
              ],
            },
            example: "; jp catches the unordered (NaN) case after a compare",
          },
        ],
        children: [],
      },
      {
        id: "asm-sse-packed",
        title: "Packed SIMD Basics",
        level: 2,
        slug: "sse-packed",
        concepts: [
          {
            id: "asm-sse-packed-intro",
            code: "movups xmm0, [va]   ; load 4 floats\nmovups xmm1, [vb]\naddps  xmm0, xmm1   ; add all 4 lanes at once\nmovups [vc], xmm0",
            note: "Packed instructions ending in `ps` or `pd` treat an xmm register as several values and operate on all lanes in parallel, the essence of SIMD. `addps` adds four single-precision floats in one instruction, which vectorizes tight numeric loops.",
            explanation: {
              heading: 'Packed SIMD operations',
              intro: 'Packed SSE instructions treat one xmm register as a vector of several values and apply the same operation to every lane at once. This single-instruction multiple-data model accelerates loops that repeat arithmetic over arrays.',
              points: [
                { term: 'Lanes in one register', detail: 'A 128-bit xmm register holds four single floats or two doubles, each occupying its own lane.' },
                { term: 'Suffix marks packed', detail: 'A ps or pd suffix means packed single or packed double, contrasting with the scalar ss and sd forms.' },
                { term: 'Parallel arithmetic', detail: 'addps adds all four float lanes simultaneously, doing the work of four scalar adds.' },
                { term: 'Alignment matters', detail: 'movaps requires the memory operand to be sixteen-byte aligned, while movups tolerates any alignment at a small cost.' },
              ],
            },
            example: "; movaps needs 16-byte-aligned memory; movups does not",
          },
        ],
        children: [],
      },
    ],
  },

  // 12. System Calls
  {
    id: "asm-syscalls",
    title: "System Calls",
    level: 1,
    slug: "system-calls",
    concepts: [],
    children: [
      {
        id: "asm-linux-syscalls",
        title: "Linux System Calls",
        level: 2,
        slug: "linux-syscalls",
        concepts: [
          {
            id: "asm-syscall-write",
            code: "section .data\n  msg db \"Hi\", 10\n  len equ $ - msg\n\nsection .text\n  mov rax, 1        ; syscall number: write\n  mov rdi, 1        ; fd 1 = stdout\n  mov rsi, msg      ; buffer\n  mov rdx, len      ; length\n  syscall",
            note: "A system call asks the operating system to perform a privileged action like writing to a file. On 64-bit Linux you place the call number in rax, arguments in rdi, rsi, rdx, and so on, then execute `syscall`. Here write (number 1) sends bytes to standard output.",
            explanation: {
              heading: 'Invoking a Linux system call',
              intro: 'A system call is how a user program requests a privileged service from the kernel, such as writing to a file or allocating memory. On 64-bit Linux you load a call number and arguments into specific registers and then trap into the kernel.',
              points: [
                { term: 'Number in rax', detail: 'The system call number selects the service, and one for write sends bytes to a file descriptor.' },
                { term: 'Arguments in registers', detail: 'The syscall convention passes arguments in rdi, rsi, rdx, r10, r8, and r9.' },
                { term: 'The syscall instruction', detail: 'Executing syscall transfers control to the kernel, which performs the action and returns to the next instruction.' },
                { term: 'Result back in rax', detail: 'The kernel returns a value or a negative error code in rax when the call completes.' },
              ],
            },
          },
          {
            id: "asm-syscall-exit",
            code: "  mov rax, 60       ; syscall number: exit\n  mov rdi, 0        ; exit status 0\n  syscall           ; the program ends here",
            note: "The exit system call terminates the program cleanly, taking the status code in rdi. Every program should end with it rather than running off the end of the code. On 32-bit Linux the mechanism differs, using int 0x80 and the eax/ebx registers.",
            explanation: {
              heading: 'Exiting cleanly',
              intro: 'A program must ask the kernel to terminate it rather than simply reaching the end of its instructions. The exit system call ends the process and hands back a status code that the parent process can inspect.',
              points: [
                { term: 'Exit number in rax', detail: 'Loading the exit call number into rax selects the terminate-process service.' },
                { term: 'Status in rdi', detail: 'The value in rdi becomes the exit code, where zero conventionally means success.' },
                { term: 'Do not fall off the end', detail: 'Without an explicit exit the processor would keep executing whatever bytes follow, causing a crash.' },
                { term: 'Legacy 32-bit path', detail: 'Older 32-bit code triggers the kernel with int 0x80 and passes the number in eax and the status in ebx.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Macros & Directives
  {
    id: "asm-macros",
    title: "Macros & Directives",
    level: 1,
    slug: "macros",
    concepts: [],
    children: [
      {
        id: "asm-assembler-directives",
        title: "Directives & Constants",
        level: 2,
        slug: "directives",
        concepts: [
          {
            id: "asm-directives-intro",
            code: "global _start        ; export a symbol to the linker\nextern printf        ; import an external symbol\n\nMAX  equ 100         ; assemble-time constant\nsection .text        ; select the code section",
            note: "Directives instruct the assembler rather than the CPU. `global` and `extern` control which symbols are visible across files for linking, `equ` defines a named constant resolved at assembly time, and `section` selects where following data or code is placed. They shape the program without emitting instructions themselves.",
            explanation: {
              heading: 'Assembler directives',
              intro: 'Directives are commands to the assembler that shape how a program is built rather than instructions the processor executes. They manage symbol visibility, define constants, and choose where code and data land.',
              points: [
                { term: 'global exports', detail: 'Marking a symbol global makes it visible to the linker so other object files can reference it.' },
                { term: 'extern imports', detail: 'Declaring a symbol extern promises it is defined elsewhere, letting the linker resolve it later.' },
                { term: 'equ defines constants', detail: 'An equ binds a name to a value computed at assembly time, with no runtime storage or cost.' },
                { term: 'section places output', detail: 'A section directive selects the target such as .text for code or .data for initialized values.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "asm-macros-topic",
        title: "Macros",
        level: 2,
        slug: "macros-topic",
        concepts: [
          {
            id: "asm-macro-def",
            code: "%macro print 2       ; NASM macro taking 2 parameters\n  mov rsi, %1        ; %1 = first argument\n  mov rdx, %2        ; %2 = second argument\n  mov rax, 1\n  mov rdi, 1\n  syscall\n%endmacro\n\n  print msg, len     ; expands inline at assembly time",
            note: "A macro defines a reusable block of code that the assembler pastes in wherever it is invoked, with parameters referenced as %1, %2, and so on. Unlike a `call`, a macro produces no jump and adds no runtime overhead because it expands at assembly time. Macros reduce repetition for common instruction sequences.",
            explanation: {
              heading: 'NASM macros',
              intro: 'A macro is a named block of source that the assembler expands inline wherever it is invoked, substituting the arguments you pass. It reduces repetitive typing without the runtime cost of a real function call.',
              points: [
                { term: 'Definition with parameter count', detail: 'A percent macro directive names the macro and states how many parameters it takes.' },
                { term: 'Numbered parameters', detail: 'Inside the body the tokens percent one and percent two stand in for the arguments supplied at each use.' },
                { term: 'Inline expansion', detail: 'Because the assembler pastes the body in place, there is no jump and no call overhead at run time.' },
                { term: 'Macro versus call', detail: 'A macro trades larger code size for speed and convenience, unlike a procedure that shares one copy through call and ret.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
